using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.API.Models;

namespace SmartOfferBooking.API.Data
{
    public static class SeedData
    {
        public static async Task SeedAsync(AppDbContext db)
        {
            if (!await db.Users.AnyAsync())
            {
                var admin = new User
                {
                    Email = "admin@slotbook.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    FullName = "System Admin",
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };
                db.Users.Add(admin);

                var business = new Business
                {
                    BusinessName = "Urban Fitness Studio",
                    BusinessType = "Gym",
                    OwnerName = "John Doe",
                    Phone = "555-0101",
                    Email = "contact@urbanfitness.com",
                    Address = "123 Main St",
                    City = "Metropolis",
                    OpeningTime = new TimeSpan(6, 0, 0),
                    ClosingTime = new TimeSpan(22, 0, 0),
                    CreatedAt = DateTime.UtcNow
                };
                db.Businesses.Add(business);
                await db.SaveChangesAsync();

                var offer = new Offer
                {
                    BusinessId = business.Id,
                    Title = "Summer Bootcamp",
                    Description = "Intense 4-week fitness bootcamp",
                    Category = "Fitness",
                    OriginalPrice = 200,
                    OfferPrice = 99,
                    DiscountPercent = 50.5m,
                    StartDate = DateTime.UtcNow.Date.AddDays(1),
                    EndDate = DateTime.UtcNow.Date.AddDays(30),
                    StartTime = new TimeSpan(7, 0, 0),
                    EndTime = new TimeSpan(8, 0, 0),
                    Capacity = 20,
                    MaxBookingPerCustomer = 1,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                };
                db.Offers.Add(offer);
                await db.SaveChangesAsync();

                var slot = new OfferSlot
                {
                    OfferId = offer.Id,
                    SlotDate = offer.StartDate,
                    StartTime = offer.StartTime,
                    EndTime = offer.EndTime,
                    Capacity = offer.Capacity,
                    BookedCount = 0,
                    AvailableCount = offer.Capacity,
                    RowVersion = Guid.NewGuid().ToByteArray(),
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow
                };
                db.OfferSlots.Add(slot);
                await db.SaveChangesAsync();
            }
        }
    }
}
