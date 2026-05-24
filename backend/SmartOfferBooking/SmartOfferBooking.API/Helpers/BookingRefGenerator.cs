using System.Security.Cryptography;

namespace SmartOfferBooking.API.Helpers
{
    public static class BookingRefGenerator
    {
        // Removed O/0/1/I/L to avoid visual confusion
        private const string Chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        public static string Generate()
        {
            var bytes = RandomNumberGenerator.GetBytes(8);
            var result = new char[8];
            for (int i = 0; i < 8; i++)
                result[i] = Chars[bytes[i] % Chars.Length];
            return $"BK-{DateTime.UtcNow:yyyyMMdd}-{new string(result)}";
        }
    }
}
