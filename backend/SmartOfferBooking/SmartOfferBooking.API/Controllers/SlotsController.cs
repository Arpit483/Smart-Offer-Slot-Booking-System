using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOfferBooking.API.DTOs.Slot;
using SmartOfferBooking.API.Helpers;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Controllers
{
    [ApiController]
    [Route("api")]
    public class SlotsController : ControllerBase
    {
        private readonly ISlotService _slotService;

        public SlotsController(ISlotService slotService)
        {
            _slotService = slotService;
        }

        [HttpGet("offers/{offerId}/slots")]
        public async Task<ActionResult<List<SlotResponse>>> GetSlots(int offerId)
        {
            return Ok(await _slotService.GetSlotsByOfferAsync(offerId));
        }

        [HttpPost("offers/{offerId}/slots")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SlotResponse>> CreateSlot(int offerId, [FromBody] CreateSlotRequest request)
        {
            try
            {
                var response = await _slotService.CreateSlotAsync(offerId, request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("slots/{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateSlotStatus(int id, [FromBody] string status)
        {
            if (!StatusValidator.IsValidSlotStatus(status))
                return BadRequest(new { message = $"Invalid slot status '{status}'. Valid values: Available, Full, Closed, Expired, Cancelled" });

            try
            {
                await _slotService.UpdateSlotStatusAsync(id, status);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("slots/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteSlot(int id)
        {
            try
            {
                await _slotService.DeleteSlotAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
