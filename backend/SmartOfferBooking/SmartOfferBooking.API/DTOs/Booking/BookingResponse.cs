namespace SmartOfferBooking.API.DTOs.Booking
{
    public class BookingResponse
    {
        public int Id { get; set; }
        public int OfferSlotId { get; set; }
        public int OfferId { get; set; }
        public string OfferTitle { get; set; } = null!;
        public DateTime SlotDate { get; set; }
        public string SlotStartTime { get; set; } = null!;
        
        public string BookingReference { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public int NumberOfPeople { get; set; }
        public string? SpecialNote { get; set; }
        public string Status { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
