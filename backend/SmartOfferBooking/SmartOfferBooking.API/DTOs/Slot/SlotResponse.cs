namespace SmartOfferBooking.API.DTOs.Slot
{
    public class SlotResponse
    {
        public int Id { get; set; }
        public int OfferId { get; set; }
        public DateTime SlotDate { get; set; }
        public string StartTime { get; set; } = null!;
        public string EndTime { get; set; } = null!;
        public int Capacity { get; set; }
        public int BookedCount { get; set; }
        public int AvailableCount { get; set; }
        public string Status { get; set; } = null!;
    }
}
