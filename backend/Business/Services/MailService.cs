using Business.Interfaces;
using Business.Settings;
using MailKit.Net.Smtp;
using MimeKit;

namespace Business.Services;

public class EmailService(EmailSettings emailSettings) : IEmailService
{
    public async Task SendEmailAsync(string recipientEmail, string subject, string body)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(emailSettings.SenderName, emailSettings.SenderEmail));
        email.To.Add(new MailboxAddress("", recipientEmail));
        email.Subject = subject;

        email.Body = new TextPart("plain") { Text = body };

        using var smtp = new SmtpClient();
        try
        {
            await smtp.ConnectAsync(emailSettings.SmtpServer, emailSettings.Port,
                MailKit.Security.SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(emailSettings.Username, emailSettings.Password);
            await smtp.SendAsync(email);
        }
        finally
        {
            await smtp.DisconnectAsync(true);
        }
    }
}