using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.API.Data;
using SmartOfferBooking.API.DTOs.Booking;
using SmartOfferBooking.API.Helpers;
using SmartOfferBooking.API.Models;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Services
{
    public class BookingService : IBookingService
    {
        private readonly AppDbContext _db;

        public BookingService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<BookingResponse>> GetAllBookingsAsync()
        {
            var bookings = await _db.Bookings
                .AsNoTracking()
                .Include(b => b.Offer)
                .Include(b => b.OfferSlot)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return bookings.Select(MapToResponse).ToList();
        }

        public async Task<BookingResponse> GetBookingByIdAsync(int id)
        {
            var booking = await _db.Bookings
                .AsNoTracking()
                .Include(b => b.Offer)
                .Include(b => b.OfferSlot)
                .FirstOrDefaultAsync(b => b.Id == id);
                
            if (booking == null) throw new Exception("Booking not found");
            return MapToResponse(booking);
        }

        public async Task<BookingResponse> GetBookingByReferenceAsync(string reference)
        {
            var booking = await _db.Bookings
                .AsNoTracking()
                .Include(b => b.Offer)
                .Include(b => b.OfferSlot)
                .FirstOrDefaultAsync(b => b.BookingReference == reference);
                
            if (booking == null) throw new Exception("Booking not found");
            return MapToResponse(booking);
        }

        public async Task<BookingResponse> CreateBookingAsync(CreateBookingRequest request)
        {
            using var transaction = await _db.Database.BeginTransactionAsync();
            try
            {
                var slot = await _db.OfferSlots
                    .Include(s => s.Offer)
                    .FirstOrDefaultAsync(s => s.Id == request.SlotId);
                    
                if (slot == null) throw new Exception("Slot not found");
                if (slot.Status != "Available") throw new Exception("Slot is not available");

                if (slot.AvailableCount < request.NumberOfPeople)
                    throw new Exception("Not enough capacity in this slot");

                // Check MaxBookingPerCustomer (by Phone)
                var existingBookings = await _db.Bookings
                    .CountAsync(b => b.Phone == request.Phone && b.OfferId == slot.OfferId && b.Status != "Cancelled");

                if (existingBookings >= slot.Offer.MaxBookingPerCustomer)
                    throw new Exception($"Maximum bookings ({slot.Offer.MaxBookingPerCustomer}) reached for this customer on this offer.");

                // Update counts
                slot.BookedCount += request.NumberOfPeople;
                slot.AvailableCount = slot.Capacity - slot.BookedCount;
                
                // Force Concurrency token update
                slot.RowVersion = Guid.NewGuid().ToByteArray();

                if (slot.AvailableCount <= 0)
                {
                    slot.Status = "Full";
                }

                var booking = new Booking
                {
                    OfferSlotId = slot.Id,
                    OfferId = slot.OfferId,
                    BookingReference = BookingRefGenerator.Generate(),
                    CustomerName = request.CustomerName,
                    Phone = request.Phone,
                    Email = request.Email,
                    NumberOfPeople = request.NumberOfPeople,
                    SpecialNote = request.SpecialNote,
                    Status = "Confirmed",
                    PaymentStatus = "Unpaid", // L1: Fixed — matches model default
                    CreatedAt = DateTime.UtcNow
                };

                _db.Bookings.Add(booking);
                await _db.SaveChangesAsync();
                await transaction.CommitAsync();

                // Reload to get Includes for response
                return await GetBookingByIdAsync(booking.Id);
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                throw new Exception("Slot was booked by someone else at the same time. Please try again.");
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateBookingStatusAsync(int id, string status)
        {
            var booking = await _db.Bookings.FindAsync(id);
            if (booking == null) throw new Exception("Booking not found");

            // If cancelled, we should free up the capacity
            if (status == "Cancelled" && booking.Status != "Cancelled")
            {
                var slot = await _db.OfferSlots.FindAsync(booking.OfferSlotId);
                if (slot != null)
                {
                    // L4: Guard against negative BookedCount
                    slot.BookedCount = Math.Max(0, slot.BookedCount - booking.NumberOfPeople);
                    slot.AvailableCount = slot.Capacity - slot.BookedCount;
                    
                    // L5: Update RowVersion on cancel for concurrency safety
                    slot.RowVersion = Guid.NewGuid().ToByteArray();
                    
                    if (slot.Status == "Full" && slot.AvailableCount > 0)
                    {
                        slot.Status = "Available";
                    }
                }
            }

            booking.Status = status;
            booking.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        private BookingResponse MapToResponse(Booking booking)
        {
            return new BookingResponse
            {
                Id = booking.Id,
                OfferSlotId = booking.OfferSlotId,
                OfferId = booking.OfferId,
                OfferTitle = booking.Offer?.Title ?? "",
                SlotDate = booking.OfferSlot?.SlotDate ?? default,
                SlotStartTime = booking.OfferSlot?.StartTime.ToString(@"hh\:mm") ?? "",
                BookingReference = booking.BookingReference,
                CustomerName = booking.CustomerName,
                Phone = booking.Phone,
                Email = booking.Email,
                NumberOfPeople = booking.NumberOfPeople,
                SpecialNote = booking.SpecialNote,
                Status = booking.Status,
                PaymentStatus = booking.PaymentStatus,
                CreatedAt = booking.CreatedAt
            };
        }
    }
}
