namespace SmartOfferBooking.API.Models
{
    public class Business
    {
        public int Id { get; set; }
        public string BusinessName { get; set; } = null!;
        public string BusinessType { get; set; } = null!;
        public string OwnerName { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string City { get; set; } = null!;
        public string? LogoBase64 { get; set; }
        public TimeSpan OpeningTime { get; set; }
        public TimeSpan ClosingTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<Offer> Offers { get; set; } = new List<Offer>();
    }
}
