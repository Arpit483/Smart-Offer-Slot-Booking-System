namespace SmartOfferBooking.API.Models
{
    public class Offer
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public Business Business { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Category { get; set; } = null!;
        public decimal OriginalPrice { get; set; }
        public decimal OfferPrice { get; set; }
        public decimal DiscountPercent { get; set; }
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        
        public int Capacity { get; set; }
        public int MaxBookingPerCustomer { get; set; } = 1;
        public string? Terms { get; set; }
        public string Status { get; set; } = null!; // Draft/Active/Paused/Expired/Cancelled
        
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<OfferSlot> Slots { get; set; } = new List<OfferSlot>();
    }
}
