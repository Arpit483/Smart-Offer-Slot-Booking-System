namespace SmartOfferBooking.API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int OfferSlotId { get; set; }
        public OfferSlot OfferSlot { get; set; } = null!;

        public int OfferId { get; set; }
        public Offer Offer { get; set; } = null!;

        public string BookingReference { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public int NumberOfPeople { get; set; }
        public string? SpecialNote { get; set; }
        
        public string Status { get; set; } = null!; // Pending/Confirmed/Cancelled/Completed/NoShow
        public string PaymentStatus { get; set; } = "Unpaid"; // Unpaid/Paid/Refunded
        
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
