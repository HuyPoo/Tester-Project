namespace Persistence.Models;

public static class Roles
{
    public const string Manager = "Manager";
    public const string Stylist = "Stylist";
    public const string Customer = "Customer";
    public static readonly IList<string> Values = [Manager, Stylist, Customer];
}