using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.API.Data;
using SmartOfferBooking.API.DTOs.Slot;
using SmartOfferBooking.API.Models;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Services
{
    public class SlotService : ISlotService
    {
        private readonly AppDbContext _db;

        public SlotService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<SlotResponse>> GetSlotsByOfferAsync(int offerId)
        {
            var slots = await _db.OfferSlots
                .AsNoTracking()
                .Where(s => s.OfferId == offerId)
                .ToListAsync();

            return slots
                .OrderBy(s => s.SlotDate)
                .ThenBy(s => s.StartTime)
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<SlotResponse> CreateSlotAsync(int offerId, CreateSlotRequest request)
        {
            var offer = await _db.Offers.FindAsync(offerId);
            if (offer == null) throw new Exception("Offer not found");

            var slot = new OfferSlot
            {
                OfferId = offerId,
                SlotDate = DateTime.SpecifyKind(request.SlotDate.Date, DateTimeKind.Utc),
                StartTime = TimeSpan.Parse(request.StartTime),
                EndTime = TimeSpan.Parse(request.EndTime),
                Capacity = request.Capacity,
                BookedCount = 0,
                AvailableCount = request.Capacity, // For SQLite manually initialized
                RowVersion = Guid.NewGuid().ToByteArray(),
                Status = "Available",
                CreatedAt = DateTime.UtcNow
            };

            _db.OfferSlots.Add(slot);
            await _db.SaveChangesAsync();

            return MapToResponse(slot);
        }

        public async Task UpdateSlotStatusAsync(int id, string status)
        {
            var slot = await _db.OfferSlots.FindAsync(id);
            if (slot == null) throw new Exception("Slot not found");

            slot.Status = status;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteSlotAsync(int id)
        {
            var slot = await _db.OfferSlots.Include(s => s.Bookings).FirstOrDefaultAsync(s => s.Id == id);
            if (slot == null) throw new Exception("Slot not found");

            if (slot.Bookings.Any())
                throw new Exception("Cannot delete slot with existing bookings");

            _db.OfferSlots.Remove(slot);
            await _db.SaveChangesAsync();
        }

        private SlotResponse MapToResponse(OfferSlot slot)
        {
            return new SlotResponse
            {
                Id = slot.Id,
                OfferId = slot.OfferId,
                SlotDate = slot.SlotDate,
                StartTime = slot.StartTime.ToString(@"hh\:mm"),
                EndTime = slot.EndTime.ToString(@"hh\:mm"),
                Capacity = slot.Capacity,
                BookedCount = slot.BookedCount,
                AvailableCount = slot.AvailableCount, // SQLite manual sync
                Status = slot.Status
            };
        }
    }
}
