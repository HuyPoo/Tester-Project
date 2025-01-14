namespace Business.Settings;

public class EmailSettings
{
    public required string FrontEndHost { get; init; }
    public required string SmtpServer { get; init; }
    public required int Port { get; init; }
    public required string SenderName { get; init; }
    public required string SenderEmail { get; init; }
    public required string Username { get; init; }
    public required string Password { get; init; }
}