using System.ComponentModel.DataAnnotations;

namespace SmartOfferBooking.API.DTOs.Offer
{
    public class CreateOfferRequest
    {
        [Required]
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        [Required]
        public string Category { get; set; } = null!;
        
        [Required, Range(0.01, 1000000)]
        public decimal OriginalPrice { get; set; }
        [Required, Range(0.01, 1000000)]
        public decimal OfferPrice { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public string StartTime { get; set; } = null!;
        [Required]
        public string EndTime { get; set; } = null!;
        
        [Required, Range(1, 10000)]
        public int Capacity { get; set; }
        [Required, Range(1, 100)]
        public int MaxBookingPerCustomer { get; set; } = 1;
        
        public string? Terms { get; set; }
        [Required]
        public string Status { get; set; } = "Draft"; // Draft or Active
    }
}
