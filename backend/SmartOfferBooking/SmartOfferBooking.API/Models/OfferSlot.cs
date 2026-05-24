using System.ComponentModel.DataAnnotations;

namespace SmartOfferBooking.API.Models
{
    public class OfferSlot
    {
        public int Id { get; set; }
        public int OfferId { get; set; }
        public Offer Offer { get; set; } = null!;

        public DateTime SlotDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int Capacity { get; set; }
        public int BookedCount { get; set; }
        
        // PERSISTED computed column (Capacity - BookedCount)
        public int AvailableCount { get; set; }
        
        public byte[] RowVersion { get; set; } = null!;
        
        public string Status { get; set; } = null!; // Available/Full/Closed/Expired/Cancelled
        public DateTime CreatedAt { get; set; }

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
