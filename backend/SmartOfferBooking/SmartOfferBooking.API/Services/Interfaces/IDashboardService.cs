using SmartOfferBooking.API.DTOs.Dashboard;

namespace SmartOfferBooking.API.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryResponse> GetSummaryAsync();
    }
}
