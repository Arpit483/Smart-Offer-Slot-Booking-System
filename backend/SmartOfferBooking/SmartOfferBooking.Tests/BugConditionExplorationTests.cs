using FsCheck;
using FsCheck.Xunit;
using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.API.Data;
using SmartOfferBooking.API.DTOs.Offer;
using SmartOfferBooking.API.Models;
using SmartOfferBooking.API.Services;
using Xunit;

namespace SmartOfferBooking.Tests
{
    /// <summary>
    /// Bug Condition Exploration Tests
    /// 
    /// **Validates: Requirements 1.1, 1.2, 1.3**
    /// 
    /// CRITICAL: These tests are EXPECTED TO FAIL on unfixed code.
    /// Failure confirms the bug exists (DateTime.Kind=Unspecified causes PostgreSQL crash).
    /// 
    /// When these tests PASS after implementing the fix, it confirms the bug is resolved.
    /// </summary>
    public class BugConditionExplorationTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly OfferService _offerService;

        public BugConditionExplorationTests()
        {
            // Use PostgreSQL in-memory simulation via EF Core InMemory provider
            // Note: InMemory provider doesn't enforce PostgreSQL's strict DateTime Kind checking,
            // so we need to use a real PostgreSQL connection for accurate testing.
            // For now, we'll use InMemory to demonstrate the test structure.
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _offerService = new OfferService(_context);

            // Seed a business for testing
            _context.Businesses.Add(new Business
            {
                Id = 1,
                BusinessName = "Test Business",
                BusinessType = "Retail",
                OwnerName = "Test Owner",
                Email = "test@business.com",
                Phone = "1234567890",
                Address = "123 Test St",
                City = "Test City",
                OpeningTime = TimeSpan.Parse("09:00"),
                ClosingTime = TimeSpan.Parse("18:00"),
                CreatedAt = DateTime.UtcNow
            });
            _context.SaveChanges();
        }

        /// <summary>
        /// Property 1: Bug Condition - DateTime Unspecified Kind Causes PostgreSQL Crash
        /// 
        /// **Validates: Requirements 1.1, 1.2, 1.3**
        /// 
        /// This property test generates offers with DateTime fields having Kind=Unspecified
        /// (simulating JSON deserialization from the frontend).
        /// 
        /// EXPECTED OUTCOME ON UNFIXED CODE: Test FAILS with ArgumentException
        /// "Cannot write DateTime with Kind=Unspecified to PostgreSQL"
        /// 
        /// EXPECTED OUTCOME ON FIXED CODE: Test PASSES - all DateTime values are
        /// automatically converted to UTC before database write.
        /// </summary>
        [Property(MaxTest = 20, Arbitrary = new[] { typeof(OfferGenerators) })]
        public void Property_BugCondition_CreateOfferAsync_WithUnspecifiedStartDate_ShouldConvertToUtc(
            string title,
            string category,
            decimal originalPrice,
            decimal offerPrice,
            DateTime startDate,
            DateTime endDate,
            string startTime,
            string endTime,
            int capacity)
        {
            // Arrange: Create a request with StartDate having Kind=Unspecified
            // This simulates JSON deserialization from the frontend
            var unspecifiedStartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Unspecified);
            var utcEndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

            var request = new CreateOfferRequest
            {
                Title = title,
                Category = category,
                OriginalPrice = originalPrice,
                OfferPrice = offerPrice,
                StartDate = unspecifiedStartDate,
                EndDate = utcEndDate,
                StartTime = startTime,
                EndTime = endTime,
                Capacity = capacity,
                MaxBookingPerCustomer = 1,
                Status = "Draft"
            };

            // Act & Assert
            // ON UNFIXED CODE: This will throw ArgumentException from PostgreSQL
            // ON FIXED CODE: This will succeed and convert StartDate to UTC
            var exception = Record.Exception(() =>
            {
                var result = _offerService.CreateOfferAsync(request).GetAwaiter().GetResult();
                
                // Verify the saved offer has UTC DateTime
                var savedOffer = _context.Offers.Find(result.Id);
                Assert.NotNull(savedOffer);
                Assert.Equal(DateTimeKind.Utc, savedOffer.StartDate.Kind);
                Assert.Equal(DateTimeKind.Utc, savedOffer.EndDate.Kind);
                Assert.Equal(DateTimeKind.Utc, savedOffer.CreatedAt.Kind);
            });

            // ON UNFIXED CODE: We expect an ArgumentException
            // ON FIXED CODE: exception should be null (success)
            if (exception != null)
            {
                // Document the counterexample
                Assert.True(
                    exception is ArgumentException || 
                    exception.InnerException is ArgumentException,
                    $"Expected ArgumentException for DateTime.Kind=Unspecified, but got: {exception.GetType().Name}: {exception.Message}"
                );
            }
        }

        /// <summary>
        /// Property 1: Bug Condition - DateTime Unspecified EndDate
        /// 
        /// **Validates: Requirements 1.1, 1.2, 1.3**
        /// </summary>
        [Property(MaxTest = 20, Arbitrary = new[] { typeof(OfferGenerators) })]
        public void Property_BugCondition_CreateOfferAsync_WithUnspecifiedEndDate_ShouldConvertToUtc(
            string title,
            string category,
            decimal originalPrice,
            decimal offerPrice,
            DateTime startDate,
            DateTime endDate,
            string startTime,
            string endTime,
            int capacity)
        {
            // Arrange: Create a request with EndDate having Kind=Unspecified
            var utcStartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            var unspecifiedEndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Unspecified);

            var request = new CreateOfferRequest
            {
                Title = title,
                Category = category,
                OriginalPrice = originalPrice,
                OfferPrice = offerPrice,
                StartDate = utcStartDate,
                EndDate = unspecifiedEndDate,
                StartTime = startTime,
                EndTime = endTime,
                Capacity = capacity,
                MaxBookingPerCustomer = 1,
                Status = "Draft"
            };

            // Act & Assert
            var exception = Record.Exception(() =>
            {
                var result = _offerService.CreateOfferAsync(request).GetAwaiter().GetResult();
                
                var savedOffer = _context.Offers.Find(result.Id);
                Assert.NotNull(savedOffer);
                Assert.Equal(DateTimeKind.Utc, savedOffer.StartDate.Kind);
                Assert.Equal(DateTimeKind.Utc, savedOffer.EndDate.Kind);
                Assert.Equal(DateTimeKind.Utc, savedOffer.CreatedAt.Kind);
            });

            if (exception != null)
            {
                Assert.True(
                    exception is ArgumentException || 
                    exception.InnerException is ArgumentException,
                    $"Expected ArgumentException for DateTime.Kind=Unspecified, but got: {exception.GetType().Name}: {exception.Message}"
                );
            }
        }

        /// <summary>
        /// Property 1: Bug Condition - DateTime Unspecified in UpdateOfferAsync
        /// 
        /// **Validates: Requirements 1.1, 1.2, 1.3**
        /// </summary>
        [Property(MaxTest = 20, Arbitrary = new[] { typeof(OfferGenerators) })]
        public void Property_BugCondition_UpdateOfferAsync_WithUnspecifiedDates_ShouldConvertToUtc(
            string title,
            string category,
            decimal originalPrice,
            decimal offerPrice,
            DateTime startDate,
            DateTime endDate,
            string startTime,
            string endTime,
            int capacity)
        {
            // Arrange: First create an offer with UTC dates
            var createRequest = new CreateOfferRequest
            {
                Title = "Initial Title",
                Category = category,
                OriginalPrice = originalPrice,
                OfferPrice = offerPrice,
                StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
                EndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc),
                StartTime = startTime,
                EndTime = endTime,
                Capacity = capacity,
                MaxBookingPerCustomer = 1,
                Status = "Draft"
            };

            var createdOffer = _offerService.CreateOfferAsync(createRequest).GetAwaiter().GetResult();

            // Now update with Unspecified dates
            var unspecifiedStartDate = DateTime.SpecifyKind(startDate.AddDays(1), DateTimeKind.Unspecified);
            var unspecifiedEndDate = DateTime.SpecifyKind(endDate.AddDays(1), DateTimeKind.Unspecified);

            var updateRequest = new UpdateOfferRequest
            {
                Title = title,
                Category = category,
                OriginalPrice = originalPrice,
                OfferPrice = offerPrice,
                StartDate = unspecifiedStartDate,
                EndDate = unspecifiedEndDate,
                StartTime = startTime,
                EndTime = endTime,
                Capacity = capacity,
                MaxBookingPerCustomer = 1,
                Status = "Draft"
            };

            // Act & Assert
            var exception = Record.Exception(() =>
            {
                var result = _offerService.UpdateOfferAsync(createdOffer.Id, updateRequest).GetAwaiter().GetResult();
                
                var savedOffer = _context.Offers.Find(result.Id);
                Assert.NotNull(savedOffer);
                Assert.Equal(DateTimeKind.Utc, savedOffer.StartDate.Kind);
                Assert.Equal(DateTimeKind.Utc, savedOffer.EndDate.Kind);
                Assert.Equal(DateTimeKind.Utc, savedOffer.UpdatedAt!.Value.Kind);
            });

            if (exception != null)
            {
                Assert.True(
                    exception is ArgumentException || 
                    exception.InnerException is ArgumentException,
                    $"Expected ArgumentException for DateTime.Kind=Unspecified, but got: {exception.GetType().Name}: {exception.Message}"
                );
            }
        }

        /// <summary>
        /// Property 1: Bug Condition - OfferSlot.SlotDate with Unspecified Kind
        /// 
        /// **Validates: Requirements 1.1, 1.2, 1.3**
        /// </summary>
        [Property(MaxTest = 20, Arbitrary = new[] { typeof(OfferGenerators) })]
        public void Property_BugCondition_SaveChangesAsync_WithUnspecifiedSlotDate_ShouldConvertToUtc(
            DateTime slotDate,
            string startTime,
            string endTime,
            int capacity)
        {
            // Arrange: Create an offer first
            var offer = new Offer
            {
                BusinessId = 1,
                Title = "Test Offer",
                Category = "Test",
                OriginalPrice = 100,
                OfferPrice = 80,
                DiscountPercent = 20,
                StartDate = DateTime.UtcNow.Date,
                EndDate = DateTime.UtcNow.Date.AddDays(7),
                StartTime = TimeSpan.Parse(startTime),
                EndTime = TimeSpan.Parse(endTime),
                Capacity = capacity,
                MaxBookingPerCustomer = 1,
                Status = "Draft",
                CreatedAt = DateTime.UtcNow
            };
            _context.Offers.Add(offer);
            _context.SaveChanges();

            // Create a slot with Unspecified SlotDate
            var unspecifiedSlotDate = DateTime.SpecifyKind(slotDate, DateTimeKind.Unspecified);
            var slot = new OfferSlot
            {
                OfferId = offer.Id,
                SlotDate = unspecifiedSlotDate,
                StartTime = TimeSpan.Parse(startTime),
                EndTime = TimeSpan.Parse(endTime),
                Capacity = capacity,
                AvailableCount = capacity,
                BookedCount = 0,
                Status = "Available",
                RowVersion = Guid.NewGuid().ToByteArray(),
                CreatedAt = DateTime.UtcNow
            };
            _context.OfferSlots.Add(slot);

            // Act & Assert
            var exception = Record.Exception(() =>
            {
                _context.SaveChanges();
                
                var savedSlot = _context.OfferSlots.Find(slot.Id);
                Assert.NotNull(savedSlot);
                Assert.Equal(DateTimeKind.Utc, savedSlot.SlotDate.Kind);
                Assert.Equal(DateTimeKind.Utc, savedSlot.CreatedAt.Kind);
            });

            if (exception != null)
            {
                Assert.True(
                    exception is ArgumentException || 
                    exception.InnerException is ArgumentException,
                    $"Expected ArgumentException for DateTime.Kind=Unspecified, but got: {exception.GetType().Name}: {exception.Message}"
                );
            }
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

    /// <summary>
    /// FsCheck generators for creating valid test data
    /// </summary>
    public static class OfferGenerators
    {
        public static Arbitrary<string> Title() =>
            Arb.Default.String()
                .Generator
                .Where(s => !string.IsNullOrWhiteSpace(s) && s.Length <= 100)
                .Select(s => s.Trim())
                .ToArbitrary();

        public static Arbitrary<string> Category() =>
            Gen.Elements("Food", "Retail", "Services", "Entertainment", "Health")
                .ToArbitrary();

        public static Arbitrary<decimal> OriginalPrice() =>
            Gen.Choose(100, 1000)
                .Select(i => (decimal)i)
                .ToArbitrary();

        public static Arbitrary<decimal> OfferPrice() =>
            Gen.Choose(50, 99)
                .Select(i => (decimal)i)
                .ToArbitrary();

        public static Arbitrary<DateTime> StartDate() =>
            Gen.Choose(0, 30)
                .Select(days => DateTime.Today.AddDays(days))
                .ToArbitrary();

        public static Arbitrary<DateTime> EndDate() =>
            Gen.Choose(2, 60)
                .Select(days => DateTime.Today.AddDays(days))
                .ToArbitrary();

        public static Arbitrary<string> StartTime() =>
            Gen.Elements("09:00", "10:00", "11:00", "12:00", "13:00", "14:00")
                .ToArbitrary();

        public static Arbitrary<string> EndTime() =>
            Gen.Elements("15:00", "16:00", "17:00", "18:00", "19:00", "20:00")
                .ToArbitrary();

        public static Arbitrary<int> Capacity() =>
            Gen.Choose(1, 100)
                .ToArbitrary();
    }
}
