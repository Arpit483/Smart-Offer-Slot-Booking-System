using SmartOfferBooking.API.DTOs.Business;

namespace SmartOfferBooking.API.Services.Interfaces
{
    public interface IBusinessService
    {
        Task<BusinessResponse> GetBusinessAsync();
        Task<BusinessResponse> UpdateBusinessAsync(BusinessRequest request);
        Task UpdateLogoAsync(string base64Logo);
    }
}
