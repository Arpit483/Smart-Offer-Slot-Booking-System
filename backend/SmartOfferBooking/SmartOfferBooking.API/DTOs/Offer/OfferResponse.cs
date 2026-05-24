namespace SmartOfferBooking.API.DTOs.Offer
{
    public class OfferResponse
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public string BusinessName { get; set; } = "";
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Category { get; set; } = null!;
        
        public decimal OriginalPrice { get; set; }
        public decimal OfferPrice { get; set; }
        public decimal DiscountPercent { get; set; }
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string StartTime { get; set; } = null!;
        public string EndTime { get; set; } = null!;
        
        public int Capacity { get; set; }
        public int MaxBookingPerCustomer { get; set; }
        public string? Terms { get; set; }
        public string Status { get; set; } = null!;
        
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
