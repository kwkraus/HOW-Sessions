# Production Ready ASP.NET Core Applications

In this session, we'll learn about how to make our ASP.NET Core application production ready by properly managing errors within the application, logging exception details for troubleshooting, and different caching options to improve performance.

Concepts for this sesssion:

- Error Handling

- Logging

- Caching

## Handling Errors

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0)

Even when an application has a well defined exception management pattern, unhandled exceptions can always sneak through.

Other types of errors can include HTTP status code errors, such as 404-NotFound and 403-Forbidden.  

In this section, we'll go over error handling in both development and production environments, how to introduce a custom status code page, as well as using Exception filters.

### Developer Exception Page

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#developer-exception-page)

The out of the box Visual Studio Razor Page template implements the Developer Exception Page when the environment is set to **Development**.

```cs
if (env.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
```

#### Throw an Exception

Open the `Index.cshtml.cs` page and add the following code to the page in order to force an exception and show the Developer Exception Page.

```cs
if (HttpContext.Request.Query.ContainsKey("throw"))
{
    throw new FileNotFoundException("File not found exception thrown in index.chtml");
}
```

When you launch the application, add the querystring `?throw=true` to the `index.cshtml` page to force a thrown exception.  You should be send to the Developer Exception Page to view the details.

>Discuss the details of the Developer Exception Page and what it provides

### Exception Handler Page

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#exception-handler-page)

When the environment is changed to something other than **Development**, the out of the box template is set to utilize the Exception Handler Page called `Error.cshtml`.

Change the environment to something other than **Development** and run the application.  Add `?throw=true` to the root url to view the `Error.cshtml` page output and discuss the implementation.

>NOTE: Make sure to discuss the Exception Handler middleware behavior and show the automatic logging in the console window.

#### Exception Handler using Lambdas

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#exception-handler-lambda)

You can also use a lambda expression when registering the middleware and gain access to the exception prior to sending a response.  To access the exception information, use the `IExceptionHandlerPathFeature` type.

To test the middleware, add the following code block to the startup.cs file and run the application to view the error response.

```cs
if (env.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "text/html";

                await context.Response.WriteAsync("<html lang=\"en\"><body>\r\n");
                await context.Response.WriteAsync("ERROR!<br><br>\r\n");

                var exceptionHandlerPathFeature =
                    context.Features.Get<IExceptionHandlerPathFeature>();

            // Use exceptionHandlerPathFeature to process the exception (for example, 
            // logging), but do NOT expose sensitive error information directly to 
            // the client.

            if (exceptionHandlerPathFeature?.Error is FileNotFoundException)
                {
                    await context.Response.WriteAsync("File error thrown!<br><br>\r\n");
                }

                await context.Response.WriteAsync("<a href=\"/\">Home</a><br>\r\n");
                await context.Response.WriteAsync("</body></html>\r\n");
                await context.Response.WriteAsync(new string(' ', 512)); // IE padding
        });
    });
    app.UseHsts();
}
```

### Use Status Code Pages

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#usestatuscodepages)

To enable default text-only handlers for common error status codes, register the UseStatusCodePages middleware within the startup.cs file

`app.UseStatusCodePages();`

>Note: order is important, make sure it is registered prior to other request handling middleware registrations.

When you run the application, go to a product details page and enter an invalid id to the querystring.  This should force a 404-NotFound status code, and the default text will display in the browser.

Time permitting, discuss the following StatusCodePage() overloads

- [StatusCodePages using Format String](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#usestatuscodepages-with-format-string)

- [StatusCodePages with Lambda](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#usestatuscodepages-with-lambda)

#### UseStatusCodePagesWithRedirects

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#usestatuscodepageswithredirects)

Discuss the reasons and benefits of this middleware registration.

This method is commonly used when the app:

- Should redirect the client to a different endpoint, usually in cases where a different app processes the error. For web apps, the client's browser address bar reflects the redirected endpoint.

- Shouldn't preserve and return the original status code with the initial redirect response.

#### UseStatusCodePagesWithReExexute

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#usestatuscodepageswithreexecute)

This method is commonly used when the app should:

- Process the request without redirecting to a different endpoint. For web apps, the client's browser address bar reflects the originally requested endpoint.

- Preserve and return the original status code with the response.

### Exception Filters

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.0#exception-filters)

## Logging

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-3.0)

## Caching

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/performance/caching/memory?view=aspnetcore-3.0)

### Cache Tag Helpers

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/built-in/cache-tag-helper?view=aspnetcore-3.0)

### Response Caching

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/performance/caching/response?view=aspnetcore-3.0)

### Distributed Caching

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/performance/caching/distributed?view=aspnetcore-3.0)

#### Distributed Cache Tag Helpers

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/built-in/distributed-cache-tag-helper?view=aspnetcore-3.0)

#### Distributed InMemory Caching

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/performance/caching/distributed?view=aspnetcore-3.0#distributed-memory-cache)

#### Distributed SQL Server Caching

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/performance/caching/distributed?view=aspnetcore-3.0#distributed-sql-server-cache)

#### Distributed Redis Caching

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/performance/caching/distributed?view=aspnetcore-3.0#distributed-redis-cache)
