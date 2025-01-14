using System.Text.Json.Serialization;

namespace Persistence.Models.Enumerations;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AppointmentStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed,
    NoShow
}