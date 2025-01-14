using AutoMapper;
using Business.DTOs;
using Persistence.Entities;

namespace Business.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateAuthMaps();
        CreateCustomerMaps();
        CreateStylistMaps();
        CreateServiceMaps();
        CreateAppointmentMaps();
        CreateSalonMaps();
    }

    private void CreateAuthMaps()
    {
        CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
    }

    private void CreateCustomerMaps()
    {
        CreateMap<User, CustomerResponse>();
        CreateMap<UpdateCustomerRequest, User>();
    }

    private void CreateStylistMaps()
    {
        CreateMap<User, StylistResponse>();
        CreateMap<CreateStylistRequest, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));

        CreateMap<UpdateStylistRequest, User>();
    }

    private void CreateServiceMaps()
    {
        CreateMap<Service, ServiceResponse>();
        CreateMap<CreateServiceRequest, Service>();
        CreateMap<UpdateServiceRequest, Service>();
    }

    private void CreateAppointmentMaps()
    {
        CreateMap<CreateAppointmentRequest, Appointment>()
            .ForMember(d => d.CustomerNotes, o => o.MapFrom(s => s.Notes));

        CreateMap<Appointment, AppointmentResponse>();
    }

    private void CreateSalonMaps()
    {
        CreateMap<Salon, SalonResponse>();
        CreateMap<UpdateSalonRequest, Salon>();
    }
}