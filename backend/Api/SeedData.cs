using Microsoft.AspNetCore.Identity;
using Persistence;
using Persistence.Entities;
using Persistence.Models;
using Persistence.Models.Enumerations;

namespace Api;

public static class SeedData
{
    private const string Password = "Passw0rd";

    private static readonly Salon Salon = new()
    {
        Name = "Virgo 14",
        Address = "Số 70 Tô Ký, Tân Chánh Hiệp, Q.12, TP. Hồ Chí Minh",
        PhoneNumber = "02838992862",
        Email = "ut-hcmc@ut.edu.vn",
        Description = "TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI THÀNH PHỐ HỒ CHÍ MINH",
        OpeningTime = new TimeOnly(8, 0),
        ClosingTime = new TimeOnly(17, 0),
        LeadWeeks = 2
    };

    private static readonly User Manager = CreateUser(
        "me@tozydev.id.vn",
        "Tân",
        "Nguyễn",
        null,
        "I'm the manager",
        ["Management"]
    );


    private static readonly List<User> Stylists =
    [
        CreateUser("chienlh0292@ut.edu.vn", "Chiến", "Lê", null, "I'm a stylist", ["Haircut"]),
        CreateUser("sangnh9789@ut.edu.vn", "Sang", "Nguyễn", null, "I'm a stylist", ["Haircut"]),
        CreateUser("mydht1719@ut.edu.vn", "My", "Đặng", null, "I'm a stylist", ["Haircut"]),
        CreateUser("yendt3558@ut.edu.vn", "Yến", "Đoàn", null, "I'm a stylist", ["Haircut"]),
        CreateUser("havhh4420@ut.edu.vn", "Hà", "Võ", null, "I'm a stylist", ["Haircut"]),
        CreateUser("duyentdm0344@ut.edu.vn", "Duyên", "Trần", null, "I'm a stylist", ["Haircut"])
    ];

    private static readonly List<User> Customers =
    [
        CreateUser("customer1@tozydev.id.vn", "Customer", "One"),
        CreateUser("customer2@tozydev.id.vn", "Customer", "Two"),
        CreateUser("customer3@tozydev.id.vn", "Customer", "Three"),
        CreateUser("customer4@tozydev.id.vn", "Customer", "Four"),
        CreateUser("customer5@tozydev.id.vn", "Customer", "Five"),
        CreateUser("customer6@tozydev.id.vn", "Customer", "Six")
    ];

    private static readonly List<Service> Services =
    [
        CreateService(
            "Cắt tóc nữ",
            "Dịch vụ cắt tóc nữ chuyên nghiệp, tạo kiểu phù hợp với gương mặt và xu hướng hiện đại.",
            60,
            150000,
            "https://www.shutterstock.com/image-photo/client-satisfaction-cheerful-woman-short-260nw-2317963787.jpg"
        ),
        CreateService(
            "Cắt tóc nam",
            "Cắt tóc nam với phong cách trẻ trung, lịch lãm, và kỹ thuật hiện đại.",
            30,
            100000,
            "https://t3.ftcdn.net/jpg/01/45/45/68/360_F_145456840_FR304Elzr4TMOy3uJnlKGkPhFdQNPRrU.jpg"
        ),
        CreateService(
            "Uốn tóc",
            "Uốn tóc với công nghệ tiên tiến, giúp tóc bồng bềnh và giữ nếp lâu dài.",
            120,
            500000,
            "https://www.shutterstock.com/image-photo/beautiful-laughing-brunette-model-girl-600nw-2501515131.jpg"
        ),
        CreateService(
            "Nhuộm tóc",
            "Dịch vụ nhuộm tóc đa dạng màu sắc, sử dụng sản phẩm an toàn và chất lượng cao.",
            90,
            450000,
            "https://d2jx2rerrg6sh3.cloudfront.net/image-handler/picture/2017/8/shutterstock_126985853.jpg"
        ),
        CreateService(
            "Gội đầu dưỡng sinh",
            "Thư giãn với dịch vụ gội đầu dưỡng sinh, giúp tóc và da đầu khỏe mạnh.",
            30,
            80000,
            "https://kellyspahcm.com/upload/filemanager/g%E1%BB%99i%20%C4%91%E1%BA%A7u%20d%C6%B0%E1%BB%A1n%20sinh/z4932747601509_cefe865e6d6ba8073be23e1e4f95fc92.jpg"
        ),
        CreateService(
            "Phục hồi tóc",
            "Phục hồi tóc hư tổn với liệu trình dưỡng chất cao cấp, mang lại mái tóc mềm mượt.",
            90,
            600000,
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT306o0jsQFgmlhKIDZ2cOcokktH_iMkzEkXw&s"
        ),
        CreateService(
            "Tạo kiểu dự tiệc",
            "Tạo kiểu tóc sang trọng, ấn tượng phù hợp cho các buổi tiệc và sự kiện đặc biệt.",
            60,
            350000,
            "https://cdn0.weddingwire.in/article/5389/3_2/1280/jpg/49835-how-to-make-puff-hairstyle-ritika-kadam-lead-image.jpeg"
        ),
        CreateService(
            "Nối tóc",
            "Dịch vụ nối tóc chuyên nghiệp, mang lại mái tóc dài dày đẹp tự nhiên.",
            180,
            1200000,
            "https://media.istockphoto.com/id/183341611/photo/hair-extension.jpg?s=612x612&w=0&k=20&c=f2IPY8MuxJ4RvkmsersDBvsaW73g6SUpV4IwJIplFdc="
        )
    ];

    private static readonly List<Tuple<Service, User[]>> ServiceStylists =
    [
        new(Services[0], Stylists.Take(2).ToArray()),
        new(Services[1], Stylists.Skip(2).Take(2).ToArray()),
        new(Services[2], Stylists.Skip(4).Take(2).ToArray()),
        new(Services[3], Stylists.Take(2).ToArray()),
        new(Services[4], Stylists.Skip(2).Take(2).ToArray()),
        new(Services[5], Stylists.Skip(4).Take(2).ToArray()),
        new(Services[6], Stylists.Take(2).ToArray()),
        new(Services[7], Stylists.Skip(2).Take(2).ToArray())
    ];

    private static readonly DateTime Date0 = new(2024, 11, 20);
    private static readonly DateTime Date1 = new(2024, 11, 25);
    private static readonly DateTime Date2 = new(2024, 11, 26);
    private static readonly DateTime Date3 = new(2024, 11, 27);
    private static readonly DateTime Date4 = new(2024, 11, 28);

    private static readonly List<Appointment> Date0Appointments =
    [
        CreateAppointment(
            Customers[0],
            Stylists[0],
            Services[0],
            Date0.AddHours(8),
            "First time visit",
            "Regular cut",
            AppointmentStatus.Completed
        ),
        CreateAppointment(
            Customers[1],
            Stylists[1],
            Services[1],
            Date0.AddHours(9),
            "Short style preferred",
            null,
            AppointmentStatus.NoShow
        ),
        CreateAppointment(
            Customers[2],
            Stylists[2],
            Services[2],
            Date0.AddHours(13),
            "Want curly style",
            "Premium service customer",
            AppointmentStatus.Cancelled
        ),
        CreateAppointment(
            Customers[3],
            Stylists[3],
            Services[3],
            Date0.AddHours(15),
            "Dark brown color",
            null,
            AppointmentStatus.Completed
        ),
        CreateAppointment(
            Customers[4],
            Stylists[4],
            Services[4],
            Date0.AddHours(16),
            null,
            "VIP customer",
            AppointmentStatus.Cancelled
        )
    ];

    private static readonly List<Appointment> Date1Appointments =
    [
        // Morning appointments
        CreateAppointment(
            Customers[0],
            Stylists[0],
            Services[0],
            Date1.AddHours(8),
            "First time visit",
            "Regular cut",
            AppointmentStatus.Completed
        ),
        CreateAppointment(
            Customers[1],
            Stylists[1],
            Services[1],
            Date1.AddHours(9),
            "Short style preferred",
            null,
            AppointmentStatus.Confirmed
        ),
        // Afternoon appointments  
        CreateAppointment(
            Customers[2],
            Stylists[2],
            Services[2],
            Date1.AddHours(13),
            "Want curly style",
            "Premium service customer"
        )
    ];

    private static readonly List<Appointment> Date2Appointments =
    [
        CreateAppointment(
            Customers[3],
            Stylists[3],
            Services[3],
            Date2.AddHours(10),
            "Dark brown color"
        ),
        CreateAppointment(
            Customers[4],
            Stylists[4],
            Services[4],
            Date2.AddHours(14),
            null,
            "VIP customer",
            AppointmentStatus.Confirmed
        )
    ];

    private static readonly List<Appointment> Date3Appointments =
    [
        CreateAppointment(
            Customers[5],
            Stylists[5],
            Services[5],
            Date3.AddHours(11),
            "Hair treatment needed"
        ),
        CreateAppointment(
            Customers[0],
            Stylists[0],
            Services[6],
            Date3.AddHours(15),
            "Wedding preparation",
            "Special care needed",
            AppointmentStatus.Confirmed
        )
    ];

    private static readonly List<Appointment> Date4Appointments =
    [
        CreateAppointment(
            Customers[1],
            Stylists[1],
            Services[7],
            Date4.AddHours(9),
            "Full hair extension"
        ),
        CreateAppointment(
            Customers[2],
            Stylists[2],
            Services[0],
            Date4.AddHours(13),
            null,
            null,
            AppointmentStatus.Confirmed
        ),
        CreateAppointment(
            Customers[3],
            Stylists[3],
            Services[1],
            Date4.AddHours(16),
            "Quick trim needed",
            "Last appointment"
        )
    ];

    public static void Initialize(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        using var context = serviceProvider.GetRequiredService<AppDbContext>();

        SeedRoles(roleManager).Wait();
        SeedSalon(context).Wait();
        SeedUsers(userManager).Wait();
        AssignRoles(userManager).Wait();
        SeedServices(context).Wait();
        SeedAppointments(context).Wait();
    }

    private static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
    {
        var roles = Roles.Values.Select(r => new IdentityRole
            {
                Name = r,
                NormalizedName = r.ToUpper()
            }
        );

        foreach (var role in roles)
        {
            if (role.Name != null && !await roleManager.RoleExistsAsync(role.Name))
            {
                await roleManager.CreateAsync(role);
            }
        }
    }

    private static async Task SeedSalon(AppDbContext context)
    {
        if (context.Salons.Any()) return;
        context.Salons.Add(Salon);
        await context.SaveChangesAsync();
    }

    private static async Task SeedUsers(UserManager<User> userManager)
    {
        if (userManager.Users.Any()) return;
        await userManager.CreateAsync(Manager, Password);
        foreach (var stylist in Stylists)
        {
            await userManager.CreateAsync(stylist, Password);
        }

        foreach (var customer in Customers)
        {
            await userManager.CreateAsync(customer, Password);
        }
    }

    private static async Task AssignRoles(UserManager<User> userManager)
    {
        if (!await userManager.IsInRoleAsync(Manager, Roles.Manager))
        {
            await userManager.AddToRoleAsync(Manager, Roles.Manager);
        }

        foreach (var stylist in Stylists)
        {
            var user = await userManager.FindByEmailAsync(stylist.Email!);
            if (user != null && !await userManager.IsInRoleAsync(user, Roles.Stylist))
            {
                await userManager.AddToRoleAsync(user, Roles.Stylist);
            }
        }

        foreach (var customer in Customers)
        {
            var user = await userManager.FindByEmailAsync(customer.Email!);
            if (user != null && !await userManager.IsInRoleAsync(user, Roles.Customer))
            {
                await userManager.AddToRoleAsync(user, Roles.Customer);
            }
        }
    }

    private static async Task SeedServices(AppDbContext context)
    {
        if (context.Services.Any()) return;
        foreach (var service in Services)
        {
            service.Stylists = ServiceStylists
                .First(ss => ss.Item1 == service)
                .Item2
                .ToList();
        }

        context.Services.AddRange(Services);
        await context.SaveChangesAsync();
    }

    private static async Task SeedAppointments(AppDbContext context)
    {
        if (context.Appointments.Any()) return;
        context.Appointments.AddRange(Date0Appointments);
        context.Appointments.AddRange(Date1Appointments);
        context.Appointments.AddRange(Date2Appointments);
        context.Appointments.AddRange(Date3Appointments);
        context.Appointments.AddRange(Date4Appointments);
        await context.SaveChangesAsync();
    }

    private static User CreateUser(
        string email,
        string firstName,
        string lastName,
        string? imageUrl = null,
        string? bio = null,
        List<string>? specialties = null
    )
    {
        return new User
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            FirstName = firstName,
            LastName = lastName,
            PhoneNumber = "0332123456",
            ImageUrl = imageUrl,
            Bio = bio,
            Specialties = specialties
        };
    }

    private static Service CreateService(
        string name,
        string description,
        int durationMinutes,
        decimal price,
        string imageUrl
    )
    {
        return new Service
        {
            Name = name,
            Description = description,
            DurationMinutes = durationMinutes,
            Price = price,
            ImageUrl = imageUrl
        };
    }

    private static Appointment CreateAppointment(
        User customer,
        User stylist,
        Service service,
        DateTime dateTime,
        string? customerNotes = null,
        string? stylistNotes = null,
        AppointmentStatus status = AppointmentStatus.Pending
    )
    {
        return new Appointment
        {
            CustomerId = customer.Id,
            Customer = customer,
            StylistId = stylist.Id,
            Stylist = stylist,
            ServiceId = service.Id,
            Service = service,
            DateTime = dateTime,
            Status = status,
            TotalPrice = service.Price,
            CustomerNotes = customerNotes,
            StylistNotes = stylistNotes
        };
    }
}