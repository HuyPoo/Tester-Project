using Business.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Api.Filters;

// ReSharper disable once ClassNeverInstantiated.Global
public class ApiExceptionFilter : ExceptionFilterAttribute
{
    public override void OnException(ExceptionContext context)
    {
        if (context.Exception is HttpResponseException httpResponseException)
        {
            context.Result = new ObjectResult(httpResponseException.Value)
            {
                StatusCode = httpResponseException.StatusCode
            };

            context.ExceptionHandled = true;
        }

        if (context.Exception is not UnauthorizedAccessException) return;

        context.Result = new ObjectResult(new
        {
            // ReSharper disable once RedundantAnonymousTypePropertyName
            Message = context.Exception.Message
        })
        {
            StatusCode = 401
        };

        context.ExceptionHandled = true;
    }
}