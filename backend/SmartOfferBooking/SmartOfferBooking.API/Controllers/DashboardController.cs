using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOfferBooking.API.DTOs.Dashboard;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryResponse>> GetSummary()
        {
            return Ok(await _dashboardService.GetSummaryAsync());
        }
    }
}
