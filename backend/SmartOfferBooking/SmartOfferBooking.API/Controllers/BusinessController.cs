using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOfferBooking.API.DTOs.Business;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Controllers
{
    [ApiController]
    [Route("api/business")]
    [Authorize(Roles = "Admin")]
    public class BusinessController : ControllerBase
    {
        private readonly IBusinessService _businessService;

        public BusinessController(IBusinessService businessService)
        {
            _businessService = businessService;
        }

        [HttpGet]
        public async Task<ActionResult<BusinessResponse>> GetBusiness()
        {
            try
            {
                return Ok(await _businessService.GetBusinessAsync());
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<ActionResult<BusinessResponse>> UpdateBusiness([FromBody] BusinessRequest request)
        {
            var response = await _businessService.UpdateBusinessAsync(request);
            return Ok(response);
        }

        [HttpPost("logo")]
        public async Task<ActionResult> UpdateLogo([FromBody] string base64Logo)
        {
            // S6: Validate logo size (max 2MB base64)
            if (string.IsNullOrEmpty(base64Logo))
                return BadRequest(new { message = "Logo data is required." });
            if (base64Logo.Length > 2 * 1024 * 1024)
                return BadRequest(new { message = "Logo is too large. Maximum size is 2MB." });

            try
            {
                await _businessService.UpdateLogoAsync(base64Logo);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
