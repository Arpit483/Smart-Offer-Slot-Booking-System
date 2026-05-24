using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOfferBooking.API.DTOs.Booking;
using SmartOfferBooking.API.Helpers;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<BookingResponse>>> GetAllBookings()
        {
            return Ok(await _bookingService.GetAllBookingsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingResponse>> GetBookingById(int id)
        {
            try
            {
                return Ok(await _bookingService.GetBookingByIdAsync(id));
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("reference/{reference}")]
        public async Task<ActionResult<BookingResponse>> GetBookingByReference(string reference)
        {
            try
            {
                return Ok(await _bookingService.GetBookingByReferenceAsync(reference));
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<BookingResponse>> CreateBooking([FromBody] CreateBookingRequest request)
        {
            try
            {
                var response = await _bookingService.CreateBookingAsync(request);
                return CreatedAtAction(nameof(GetBookingById), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateBookingStatus(int id, [FromBody] string status)
        {
            if (!StatusValidator.IsValidBookingStatus(status))
                return BadRequest(new { message = $"Invalid booking status '{status}'. Valid values: Pending, Confirmed, Cancelled, Completed, No Show" });

            try
            {
                await _bookingService.UpdateBookingStatusAsync(id, status);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
