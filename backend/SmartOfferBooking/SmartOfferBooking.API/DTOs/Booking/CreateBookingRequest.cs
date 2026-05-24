using System.ComponentModel.DataAnnotations;

namespace SmartOfferBooking.API.DTOs.Booking
{
    public class CreateBookingRequest
    {
        [Required]
        public int SlotId { get; set; }
        [Required]
        public string CustomerName { get; set; } = null!;
        [Required, Phone]
        public string Phone { get; set; } = null!;
        [Required, EmailAddress]
        public string Email { get; set; } = null!;
        [Required, Range(1, 100)]
        public int NumberOfPeople { get; set; }
        public string? SpecialNote { get; set; }
    }
}
