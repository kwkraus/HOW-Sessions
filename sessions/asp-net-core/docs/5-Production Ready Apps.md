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

When you launch the application, add the querystring `?throw` to the `index.cshtml` page to force a thrown exception.  You should be send to the Developer Exception Page to view the details.

>Discuss the details of the Developer Exception Page and what it provides

### Exception Handler Page

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#exception-handler-page)

When the environment is changed to something other than **Development**, the out of the box template is set to utilize the Exception Handler Page called `Error.cshtml`.

Change the environment to something other than **Development** and run the application.  Add `?throw` to the root url to view the `Error.cshtml` page output and discuss the implementation.

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

Discuss the reasons and benefits of this middleware registration.

This method is commonly used when the app should:

- Process the request without redirecting to a different endpoint. For web apps, the client's browser address bar reflects the originally requested endpoint.

- Preserve and return the original status code with the response.

### Exception Filters

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.0#exception-filters)

## Logging

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-3.0)

In this section, we'll discuss the default logging configuration and how to add additional logging providers based on your logging needs.

We'll demonstrate how to inject the logger into classes and how to utilize the logging API.

We'll also touch on how to log errors and telemetry to Azure Application Insights, as well as how to integrate Application Insights with existing logging providers.

### Logging Fundamentals

Why Log? The goal of logging is to know what’s really happening in your app and diagnose issues quickly.  In order to do this, we need to follow a few principals.

- **Basic logging around everything** – For every key transaction in your code you should have some basic logging in your code

- **Log contextual data** – Logging “something happened” is not enough. You need relevant, contextual logs

- **Aggregate logs** – Consolidate and aggregate all of our logging to a central location, available to all devs, and easy to distill.

- **Proactively use logs** – Monitor your logging for errors and key things that are problematic

Within a production application, logging "noise" can become a problem and sifting through this noise to find the root of a problem can be time consuming.

Logging frameworks have long implemented Logging Levels that allow for filtering certain levels of events to create less noise.  Production systems are typically only concerned with exceptions thrown and/or warning levels that may indicate health issues.

#### Exception Logging Strategies

[Reference Doc](https://docs.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions)

Microsoft has several exceptions handling best practices that can be shared with students, but the main points to be made in this section are the following:

- Only handle exceptions that you can actually do something about

- Preserve the stacktrace by calling `throw;` for an existing caught exception or by wrapping a caught exception with a new contextually pertinent exception.

This relates to logging because we need to log all of this exception context as some point.  When using the Exception Handler middleware, we will be able to inspect the full stacktrace through the default logging, which is a good thing.

### Default Logging Configuration

[Reference Doc](https://docs.microsoft.com/en-us/dotnet/api/microsoft.extensions.hosting.host.createdefaultbuilder?view=dotnet-plat-ext-3.0)

The default logging configuration is set through the use of the `CreateDefaultBuilder(args)` method that is called within the `Program.cs` class at startup.

The following providers are added:

- Console

- Debug

- EventSource

- EventLog (only when running on Windows)

To demonstrate the default logging capabilities, run the application and add `?throw` to the root url to generate an exception.  Show the exception output through the console.

You can also open the Event Viewer on Windows and show the output entry in the Application log.

### Inject Logger within Application

You can gain access to the logger through dependency injection and log events throughout your application.

Let's inject a logger into one of our pages and log an event.

Open the `Index.cshtml.cs` home page within the Pages folder and add the following code to the constructor.  This will create a new ILogger with a category of IndexModel.

```cs
private readonly ILogger<IndexModel> _logger;

public IndexModel(ILogger<IndexModel> logger)
{
    _logger = logger;
}
```

When an IndexModel class is created, ASP.NET Core will recognize that it's asking for an ILogger.  It will inject the configured logger for the application and we can call logging APIs.

To log an event, we can add the following code to the `OnGet()` method.  Add the following line of code to the if statement for the "throw" check.  This will log a critical event just prior to throwing the exception.

```cs
_logger.LogCritical("We're about to throw an exception... get ready for it...");
```

### Change Logging Providers

We can add/remove the default logging providers through the `IHostBuilder` within the `Program.cs` class.

To remove all configured providers and add just the Console provider, add the following code to the `Program.cs` class within the `CreateHostBuilder()` method.

```cs
.ConfigureLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
})
```

When you run the application, you will see a new log event just prior to the exception logging.

### Application Insights

Application Insights is...

#### Application Insights SDK

The Application Insights SDK provides these benefits:

- **Comprehensive data collection**: Data like user retention, unique users, and unique sessions is available in Application Insights only when you use the Application Insights SDK.

- **Custom telemetry**: With the SDK, you can add code to your application to capture events and metrics that are specific to your app and its business domain.

- **Advanced features**: Some Application Insights features are available only when you use the SDK. For example, Live Metrics Stream lets you watch and drill down into metrics in real time.

- **Local telemetry in Visual Studio**: Telemetry data from applications instrumented with the SDK can be viewed locally in Visual Studio when you run the app in the debugger.

#### Application Insights trace logging

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-3.1#azure-application-insights-trace-logging)

The Visual Studio Razor Page template sets up a default configuration for logging using the `CreateDefaultBuilder(args)` call within the `Program.cs` file.

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
