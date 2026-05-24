using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.API.Data;
using SmartOfferBooking.API.DTOs.Offer;
using SmartOfferBooking.API.Models;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Services
{
    public class OfferService : IOfferService
    {
        private readonly AppDbContext _db;

        public OfferService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<OfferResponse>> GetAdminOffersAsync()
        {
            var offers = await _db.Offers
                .AsNoTracking()
                .Include(o => o.Business)
                .OrderByDescending(o => o.CreatedAt).ToListAsync();
            return offers.Select(MapToResponse).ToList();
        }

        public async Task<List<OfferResponse>> GetPublicOffersAsync()
        {
            var now = DateTime.UtcNow.Date;
            var offers = await _db.Offers
                .AsNoTracking()
                .Include(o => o.Business)
                .Where(o => o.Status == "Active" && o.EndDate >= now)
                .OrderBy(o => o.EndDate)
                .ToListAsync();
            return offers.Select(MapToResponse).ToList();
        }

        public async Task<OfferResponse> GetOfferByIdAsync(int id)
        {
            var offer = await _db.Offers
                .Include(o => o.Business)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (offer == null) throw new Exception("Offer not found");
            return MapToResponse(offer);
        }

        public async Task<OfferResponse> CreateOfferAsync(CreateOfferRequest request)
        {
            var business = await _db.Businesses.FirstOrDefaultAsync();
            if (business == null) throw new Exception("Business profile not found. Please create a business profile first.");

            // L7 + V1: Validate pricing
            if (request.OfferPrice >= request.OriginalPrice)
                throw new Exception("Offer price must be less than original price.");

            // V2: Validate dates
            if (request.EndDate < request.StartDate)
                throw new Exception("End date must be on or after start date.");

            // L8: Cap slot generation to 90 days
            var daySpan = (request.EndDate.Date - request.StartDate.Date).Days;
            if (daySpan > 90)
                throw new Exception("Offer date range cannot exceed 90 days.");

            // V6: Validate time format
            if (!TimeSpan.TryParse(request.StartTime, out var startTs))
                throw new Exception("Invalid start time format. Use HH:mm.");
            if (!TimeSpan.TryParse(request.EndTime, out var endTs))
                throw new Exception("Invalid end time format. Use HH:mm.");
            if (endTs <= startTs)
                throw new Exception("End time must be after start time.");

            decimal discount = 0;
            if (request.OriginalPrice > 0)
            {
                discount = ((request.OriginalPrice - request.OfferPrice) / request.OriginalPrice) * 100;
            }

            var offer = new Offer
            {
                BusinessId = business.Id,
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                OriginalPrice = request.OriginalPrice,
                OfferPrice = request.OfferPrice,
                DiscountPercent = Math.Round(discount, 2),
                StartDate = DateTime.SpecifyKind(request.StartDate.Date, DateTimeKind.Utc),
                EndDate = DateTime.SpecifyKind(request.EndDate.Date, DateTimeKind.Utc),
                StartTime = startTs,
                EndTime = endTs,
                Capacity = request.Capacity,
                MaxBookingPerCustomer = request.MaxBookingPerCustomer,
                Terms = request.Terms,
                Status = request.Status,
                CreatedAt = DateTime.UtcNow
            };

            _db.Offers.Add(offer);
            await _db.SaveChangesAsync();

            // Auto-generate a slot for each day between StartDate and EndDate
            var slots = new List<OfferSlot>();
            for (var date = offer.StartDate.Date; date <= offer.EndDate.Date; date = date.AddDays(1))
            {
                slots.Add(new OfferSlot
                {
                    OfferId = offer.Id,
                    SlotDate = DateTime.SpecifyKind(date, DateTimeKind.Utc),
                    StartTime = offer.StartTime,
                    EndTime = offer.EndTime,
                    Capacity = offer.Capacity,
                    AvailableCount = offer.Capacity,
                    BookedCount = 0,
                    Status = "Available",
                    RowVersion = Guid.NewGuid().ToByteArray(),
                    CreatedAt = DateTime.UtcNow
                });
            }
            if (slots.Count > 0)
            {
                _db.OfferSlots.AddRange(slots);
                await _db.SaveChangesAsync();
            }

            // Reload with Business include for response
            offer = await _db.Offers.Include(o => o.Business).FirstAsync(o => o.Id == offer.Id);
            return MapToResponse(offer);
        }

        public async Task<OfferResponse> UpdateOfferAsync(int id, UpdateOfferRequest request)
        {
            var offer = await _db.Offers.Include(o => o.Slots).FirstOrDefaultAsync(o => o.Id == id);
            if (offer == null) throw new Exception("Offer not found");

            // Validations
            if (request.OfferPrice >= request.OriginalPrice)
                throw new Exception("Offer price must be less than original price.");
            if (request.EndDate < request.StartDate)
                throw new Exception("End date must be on or after start date.");
            if (!TimeSpan.TryParse(request.StartTime, out var startTs))
                throw new Exception("Invalid start time format. Use HH:mm.");
            if (!TimeSpan.TryParse(request.EndTime, out var endTs))
                throw new Exception("Invalid end time format. Use HH:mm.");
            if (endTs <= startTs)
                throw new Exception("End time must be after start time.");

            decimal discount = 0;
            if (request.OriginalPrice > 0)
            {
                discount = ((request.OriginalPrice - request.OfferPrice) / request.OriginalPrice) * 100;
            }

            offer.Title = request.Title;
            offer.Description = request.Description;
            offer.Category = request.Category;
            offer.OriginalPrice = request.OriginalPrice;
            offer.OfferPrice = request.OfferPrice;
            offer.DiscountPercent = Math.Round(discount, 2);
            offer.StartDate = DateTime.SpecifyKind(request.StartDate.Date, DateTimeKind.Utc);
            offer.EndDate = DateTime.SpecifyKind(request.EndDate.Date, DateTimeKind.Utc);
            offer.StartTime = startTs;
            offer.EndTime = endTs;
            offer.Capacity = request.Capacity;
            offer.MaxBookingPerCustomer = request.MaxBookingPerCustomer;
            offer.Terms = request.Terms;
            offer.Status = request.Status;
            offer.UpdatedAt = DateTime.UtcNow;

            // L2: Sync slots — remove unbooked slots and regenerate
            var unbookedSlots = offer.Slots.Where(s => s.BookedCount == 0).ToList();
            _db.OfferSlots.RemoveRange(unbookedSlots);

            // Regenerate slots for dates that don't have booked slots
            var bookedDates = offer.Slots.Where(s => s.BookedCount > 0).Select(s => s.SlotDate.Date).ToHashSet();
            for (var date = offer.StartDate.Date; date <= offer.EndDate.Date; date = date.AddDays(1))
            {
                if (!bookedDates.Contains(date))
                {
                    _db.OfferSlots.Add(new OfferSlot
                    {
                        OfferId = offer.Id,
                        SlotDate = DateTime.SpecifyKind(date, DateTimeKind.Utc),
                        StartTime = startTs,
                        EndTime = endTs,
                        Capacity = offer.Capacity,
                        AvailableCount = offer.Capacity,
                        BookedCount = 0,
                        Status = "Available",
                        RowVersion = Guid.NewGuid().ToByteArray(),
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await _db.SaveChangesAsync();

            offer = await _db.Offers.Include(o => o.Business).FirstAsync(o => o.Id == offer.Id);
            return MapToResponse(offer);
        }

        public async Task UpdateOfferStatusAsync(int id, string status)
        {
            var offer = await _db.Offers.FindAsync(id);
            if (offer == null) throw new Exception("Offer not found");

            offer.Status = status;
            offer.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteOfferAsync(int id)
        {
            var offer = await _db.Offers
                .Include(o => o.Slots)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (offer == null) throw new Exception("Offer not found");

            // L3: Check for any bookings (not just booked count)
            var hasBookings = await _db.Bookings.AnyAsync(b => b.OfferId == id);
            if (hasBookings)
                throw new Exception("Cannot delete offer with existing bookings. Try cancelling it instead.");

            // Remove all slots first, then the offer
            _db.OfferSlots.RemoveRange(offer.Slots);
            _db.Offers.Remove(offer);
            await _db.SaveChangesAsync();
        }

        private OfferResponse MapToResponse(Offer offer)
        {
            return new OfferResponse
            {
                Id = offer.Id,
                BusinessId = offer.BusinessId,
                BusinessName = offer.Business?.BusinessName ?? "",
                Title = offer.Title,
                Description = offer.Description,
                Category = offer.Category,
                OriginalPrice = offer.OriginalPrice,
                OfferPrice = offer.OfferPrice,
                DiscountPercent = offer.DiscountPercent,
                StartDate = offer.StartDate,
                EndDate = offer.EndDate,
                StartTime = offer.StartTime.ToString(@"hh\:mm"),
                EndTime = offer.EndTime.ToString(@"hh\:mm"),
                Capacity = offer.Capacity,
                MaxBookingPerCustomer = offer.MaxBookingPerCustomer,
                Terms = offer.Terms,
                Status = offer.Status,
                CreatedAt = offer.CreatedAt,
                UpdatedAt = offer.UpdatedAt
            };
        }
    }
}
