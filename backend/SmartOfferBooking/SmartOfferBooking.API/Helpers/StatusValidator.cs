namespace SmartOfferBooking.API.Helpers
{
    public static class StatusValidator
    {
        private static readonly HashSet<string> ValidOfferStatuses = new()
            { "Draft", "Active", "Paused", "Expired", "Cancelled" };
        private static readonly HashSet<string> ValidBookingStatuses = new()
            { "Pending", "Confirmed", "Cancelled", "Completed", "No Show" };
        private static readonly HashSet<string> ValidSlotStatuses = new()
            { "Available", "Full", "Closed", "Expired", "Cancelled" };

        public static bool IsValidOfferStatus(string status) => ValidOfferStatuses.Contains(status);
        public static bool IsValidBookingStatus(string status) => ValidBookingStatuses.Contains(status);
        public static bool IsValidSlotStatus(string status) => ValidSlotStatuses.Contains(status);
    }
}
