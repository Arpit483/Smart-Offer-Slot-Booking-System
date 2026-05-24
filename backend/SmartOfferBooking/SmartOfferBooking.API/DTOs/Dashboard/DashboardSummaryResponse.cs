namespace SmartOfferBooking.API.DTOs.Dashboard
{
    public class DashboardSummaryResponse
    {
        public int TotalBookings { get; set; }
        public int TotalOffers { get; set; }
        public int ActiveOffers { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TodayBookings { get; set; }
        public int TotalCapacity { get; set; }
        public int TotalBooked { get; set; }
        public int TotalAvailable { get; set; }
        public decimal ConversionRate { get; set; }
        
        public List<RecentBookingResponse> RecentBookings { get; set; } = new();
    }

    public class RecentBookingResponse
    {
        public string CustomerName { get; set; } = null!;
        public string OfferTitle { get; set; } = null!;
        public string BookingReference { get; set; } = null!;
        public int NumberOfPeople { get; set; }
        public string TimeAgo { get; set; } = null!;
        public decimal Amount { get; set; }
        public string Status { get; set; } = "Confirmed";
    }
}
