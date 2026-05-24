using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.API.Models;

namespace SmartOfferBooking.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Business> Businesses { get; set; } = null!;
        public DbSet<Offer> Offers { get; set; } = null!;
        public DbSet<OfferSlot> OfferSlots { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<DateTime>()
                .HaveColumnType("timestamp without time zone");
            configurationBuilder.Properties<DateTime?>()
                .HaveColumnType("timestamp without time zone");
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Users
            builder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            // Offer
            builder.Entity<Offer>()
                .HasIndex(o => o.Status);

            builder.Entity<Offer>()
                .HasIndex(o => o.EndDate);

            builder.Entity<Offer>()
                .Property(o => o.OfferPrice)
                .HasPrecision(10, 2);
            
            builder.Entity<Offer>()
                .Property(o => o.OriginalPrice)
                .HasPrecision(10, 2);
                
            builder.Entity<Offer>()
                .Property(o => o.DiscountPercent)
                .HasPrecision(5, 2);

            builder.Entity<Offer>()
                .ToTable(t => {
                    t.HasCheckConstraint("CK_Offer_Price", "\"OfferPrice\" < \"OriginalPrice\"");
                    t.HasCheckConstraint("CK_Offer_EndDate", "\"EndDate\" >= \"StartDate\"");
                    t.HasCheckConstraint("CK_Offer_Capacity", "\"Capacity\" > 0");
                });

            // Offer -> Business relationship
            builder.Entity<Offer>()
                .HasOne(o => o.Business)
                .WithMany(b => b.Offers)
                .HasForeignKey(o => o.BusinessId)
                .OnDelete(DeleteBehavior.Restrict);

            // OfferSlot
            builder.Entity<OfferSlot>()
                .HasIndex(s => s.OfferId);

            builder.Entity<OfferSlot>()
                .HasIndex(s => s.SlotDate);

            builder.Entity<OfferSlot>()
                .HasIndex(s => s.Status);

            builder.Entity<OfferSlot>()
                .Property(e => e.RowVersion)
                .IsConcurrencyToken();

            // Booking
            builder.Entity<Booking>()
                .HasIndex(b => b.BookingReference)
                .IsUnique();

            builder.Entity<Booking>()
                .HasIndex(b => new { b.Phone, b.OfferId });

            builder.Entity<Booking>()
                .ToTable(t => t.HasCheckConstraint("CK_Booking_NumberOfPeople", "\"NumberOfPeople\" > 0"));

            // Relationships
            builder.Entity<Booking>()
                .HasOne(b => b.OfferSlot)
                .WithMany(s => s.Bookings)
                .HasForeignKey(b => b.OfferSlotId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Booking>()
                .HasOne(b => b.Offer)
                .WithMany()
                .HasForeignKey(b => b.OfferId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
