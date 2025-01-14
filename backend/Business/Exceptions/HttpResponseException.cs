using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Business.Exceptions;

public class HttpResponseException(int statusCode, string? message = null, object? value = null) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
    public object? Value { get; } = value;

    internal static HttpResponseException NotFound(string? message = null)
        => new(StatusCodes.Status404NotFound, message);

    internal static HttpResponseException BadRequest(string? message = null, object? value = null)
        => new(StatusCodes.Status400BadRequest, message, value);

    internal static HttpResponseException BadRequest(IEnumerable<IdentityError> errors, string? message = null)
        => new(StatusCodes.Status400BadRequest, message, errors.Select(e => e.Description));
}