using SmartOfferBooking.API.DTOs.Booking;

namespace SmartOfferBooking.API.Services.Interfaces
{
    public interface IBookingService
    {
        Task<List<BookingResponse>> GetAllBookingsAsync();
        Task<BookingResponse> GetBookingByIdAsync(int id);
        Task<BookingResponse> GetBookingByReferenceAsync(string reference);
        Task<BookingResponse> CreateBookingAsync(CreateBookingRequest request);
        Task UpdateBookingStatusAsync(int id, string status);
    }
}
