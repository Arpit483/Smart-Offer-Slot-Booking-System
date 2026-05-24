using SmartOfferBooking.API.DTOs.Offer;

namespace SmartOfferBooking.API.Services.Interfaces
{
    public interface IOfferService
    {
        Task<List<OfferResponse>> GetAdminOffersAsync();
        Task<List<OfferResponse>> GetPublicOffersAsync();
        Task<OfferResponse> GetOfferByIdAsync(int id);
        Task<OfferResponse> CreateOfferAsync(CreateOfferRequest request);
        Task<OfferResponse> UpdateOfferAsync(int id, UpdateOfferRequest request);
        Task UpdateOfferStatusAsync(int id, string status);
        Task DeleteOfferAsync(int id);
    }
}
