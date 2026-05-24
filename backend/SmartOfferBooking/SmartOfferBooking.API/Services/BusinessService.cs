using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.API.Data;
using SmartOfferBooking.API.DTOs.Business;
using SmartOfferBooking.API.Services.Interfaces;

namespace SmartOfferBooking.API.Services
{
    public class BusinessService : IBusinessService
    {
        private readonly AppDbContext _db;

        public BusinessService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<BusinessResponse> GetBusinessAsync()
        {
            var business = await _db.Businesses.FirstOrDefaultAsync();
            if (business == null) throw new Exception("Business profile not found");

            return new BusinessResponse
            {
                Id = business.Id,
                BusinessName = business.BusinessName,
                BusinessType = business.BusinessType,
                OwnerName = business.OwnerName,
                Phone = business.Phone,
                Email = business.Email,
                Address = business.Address,
                City = business.City,
                LogoBase64 = business.LogoBase64,
                OpeningTime = business.OpeningTime.ToString(@"hh\:mm"),
                ClosingTime = business.ClosingTime.ToString(@"hh\:mm")
            };
        }

        public async Task<BusinessResponse> UpdateBusinessAsync(BusinessRequest request)
        {
            var business = await _db.Businesses.FirstOrDefaultAsync();
            if (business == null)
            {
                business = new Models.Business { CreatedAt = DateTime.UtcNow };
                _db.Businesses.Add(business);
            }

            business.BusinessName = request.BusinessName;
            business.BusinessType = request.BusinessType;
            business.OwnerName = request.OwnerName;
            business.Phone = request.Phone;
            business.Email = request.Email;
            business.Address = request.Address;
            business.City = request.City;
            
            if (request.LogoBase64 != null)
                business.LogoBase64 = request.LogoBase64;
                
            business.OpeningTime = TimeSpan.Parse(request.OpeningTime);
            business.ClosingTime = TimeSpan.Parse(request.ClosingTime);
            business.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return await GetBusinessAsync();
        }

        public async Task UpdateLogoAsync(string base64Logo)
        {
            var business = await _db.Businesses.FirstOrDefaultAsync();
            if (business == null) throw new Exception("Business profile not found");

            business.LogoBase64 = base64Logo;
            business.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }
}
