using System.ComponentModel.DataAnnotations;

namespace SmartOfferBooking.API.DTOs.Slot
{
    public class CreateSlotRequest
    {
        [Required]
        public DateTime SlotDate { get; set; }
        
        [Required]
        public string StartTime { get; set; } = null!;
        
        [Required]
        public string EndTime { get; set; } = null!;
        
        [Required, Range(1, 10000)]
        public int Capacity { get; set; }
    }
}
