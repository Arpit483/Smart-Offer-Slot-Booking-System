namespace SmartOfferBooking.API.DTOs.Business
{
    public class BusinessResponse
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
        public string OpeningTime { get; set; } = null!;
        public string ClosingTime { get; set; } = null!;
    }
}
