using System.ComponentModel.DataAnnotations;

namespace SmartOfferBooking.API.DTOs.Business
{
    public class BusinessRequest
    {
        [Required]
        public string BusinessName { get; set; } = null!;
        [Required]
        public string BusinessType { get; set; } = null!;
        [Required]
        public string OwnerName { get; set; } = null!;
        [Required, Phone]
        public string Phone { get; set; } = null!;
        [Required, EmailAddress]
        public string Email { get; set; } = null!;
        [Required]
        public string Address { get; set; } = null!;
        [Required]
        public string City { get; set; } = null!;
        
        public string? LogoBase64 { get; set; }
        
        [Required]
        public string OpeningTime { get; set; } = null!;
        [Required]
        public string ClosingTime { get; set; } = null!;
    }
}
