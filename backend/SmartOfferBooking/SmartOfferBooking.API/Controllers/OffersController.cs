using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOfferBooking.API.DTOs.Offer;
using SmartOfferBooking.API.Helpers;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Controllers
{
    [ApiController]
    [Route("api/offers")]
    public class OffersController : ControllerBase
    {
        private readonly IOfferService _offerService;

        public OffersController(IOfferService offerService)
        {
            _offerService = offerService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<OfferResponse>>> GetAdminOffers()
        {
            return Ok(await _offerService.GetAdminOffersAsync());
        }

        [HttpGet("public")]
        public async Task<ActionResult<List<OfferResponse>>> GetPublicOffers()
        {
            return Ok(await _offerService.GetPublicOffersAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OfferResponse>> GetOfferById(int id)
        {
            try
            {
                return Ok(await _offerService.GetOfferByIdAsync(id));
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OfferResponse>> CreateOffer([FromBody] CreateOfferRequest request)
        {
            try
            {
                var response = await _offerService.CreateOfferAsync(request);
                return CreatedAtAction(nameof(GetOfferById), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OfferResponse>> UpdateOffer(int id, [FromBody] UpdateOfferRequest request)
        {
            try
            {
                return Ok(await _offerService.UpdateOfferAsync(id, request));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateOfferStatus(int id, [FromBody] string status)
        {
            if (!StatusValidator.IsValidOfferStatus(status))
                return BadRequest(new { message = $"Invalid offer status '{status}'. Valid values: Draft, Active, Paused, Expired, Cancelled" });

            try
            {
                await _offerService.UpdateOfferStatusAsync(id, status);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteOffer(int id)
        {
            try
            {
                await _offerService.DeleteOfferAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
