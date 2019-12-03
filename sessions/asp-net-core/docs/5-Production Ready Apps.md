# Production Ready ASP.NET Core Applications

In this session, we'll learn about how to make our ASP.NET Core application production ready by propertly managing unhandled exceptions, logging exception details for troubleshooting, and different caching options to improve performance.

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

### Use Status Code Pages

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#usestatuscodepages)

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
