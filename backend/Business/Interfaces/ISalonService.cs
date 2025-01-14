using Business.DTOs;

namespace Business.Interfaces;

public interface ISalonService
{
    Task<SalonResponse> GetSalonAsync();

    Task<SalonResponse> UpdateSalonAsync(UpdateSalonRequest request);
}