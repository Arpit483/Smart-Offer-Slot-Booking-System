using SmartOfferBooking.API.DTOs.Auth;

namespace SmartOfferBooking.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
    }
}
