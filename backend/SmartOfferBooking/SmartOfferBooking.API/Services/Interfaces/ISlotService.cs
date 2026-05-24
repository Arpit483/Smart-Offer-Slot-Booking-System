using SmartOfferBooking.API.DTOs.Slot;

namespace SmartOfferBooking.API.Services.Interfaces
{
    public interface ISlotService
    {
        Task<List<SlotResponse>> GetSlotsByOfferAsync(int offerId);
        Task<SlotResponse> CreateSlotAsync(int offerId, CreateSlotRequest request);
        Task UpdateSlotStatusAsync(int id, string status);
        Task DeleteSlotAsync(int id);
    }
}
