using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.API.Data;
using SmartOfferBooking.API.DTOs.Dashboard;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _db;

        public DashboardService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<DashboardSummaryResponse> GetSummaryAsync()
        {
            var now = DateTime.UtcNow;
            var todayStart = now.Date;

            var totalBookings = await _db.Bookings.CountAsync();
            var totalOffers = await _db.Offers.CountAsync();
            
            var activeOffers = await _db.Offers.CountAsync(o => o.Status == "Active" && o.EndDate >= todayStart);
            
            var todayBookings = await _db.Bookings.CountAsync(b => b.CreatedAt >= todayStart);

            // P1: Revenue — project to anonymous type for SQL Server compatibility
            var nonCancelledBookings = await _db.Bookings
                .AsNoTracking()
                .Include(b => b.Offer)
                .Where(b => b.Status != "Cancelled")
                .Select(b => new { b.NumberOfPeople, OfferPrice = b.Offer != null ? b.Offer.OfferPrice : 0 })
                .ToListAsync();
                
            var revenue = nonCancelledBookings.Sum(b => (decimal)b.NumberOfPeople * b.OfferPrice);

            // New metrics: Capacity, Booked, Available from active offer slots
            var activeSlotStats = await _db.OfferSlots
                .AsNoTracking()
                .Where(s => s.Offer.Status == "Active" && s.Offer.EndDate >= todayStart)
                .GroupBy(s => 1)
                .Select(g => new
                {
                    TotalCapacity = g.Sum(s => s.Capacity),
                    TotalBooked = g.Sum(s => s.BookedCount)
                })
                .FirstOrDefaultAsync();

            var totalCapacity = activeSlotStats?.TotalCapacity ?? 0;
            var totalBooked = activeSlotStats?.TotalBooked ?? 0;
            var totalAvailable = totalCapacity - totalBooked;
            var conversionRate = totalCapacity > 0 ? Math.Round((decimal)totalBooked / totalCapacity * 100, 1) : 0;

            var recent = await _db.Bookings
                .AsNoTracking()
                .Include(b => b.Offer)
                .OrderByDescending(b => b.CreatedAt)
                .Take(10)
                .ToListAsync();

            var recentResponses = recent.Select(b => new RecentBookingResponse
            {
                CustomerName = b.CustomerName,
                OfferTitle = b.Offer?.Title ?? "Unknown Offer",
                BookingReference = b.BookingReference,
                NumberOfPeople = b.NumberOfPeople,
                Amount = b.NumberOfPeople * (b.Offer?.OfferPrice ?? 0),
                TimeAgo = GetTimeAgo(b.CreatedAt, now),
                Status = b.Status
            }).ToList();

            return new DashboardSummaryResponse
            {
                TotalBookings = totalBookings,
                TotalOffers = totalOffers,
                ActiveOffers = activeOffers,
                TotalRevenue = revenue,
                TodayBookings = todayBookings,
                TotalCapacity = totalCapacity,
                TotalBooked = totalBooked,
                TotalAvailable = totalAvailable,
                ConversionRate = conversionRate,
                RecentBookings = recentResponses
            };
        }

        private string GetTimeAgo(DateTime past, DateTime now)
        {
            var ts = now - past;
            if (ts.TotalMinutes < 60)
                return $"{(int)ts.TotalMinutes} mins ago";
            if (ts.TotalHours < 24)
                return $"{(int)ts.TotalHours} hours ago";
            return $"{(int)ts.TotalDays} days ago";
        }
    }
}
