# Production Ready ASP.NET Core Applications

In this session, we'll learn about how to make our ASP.NET Core application production ready by propertly managing unhandled exceptions, logging exception details for troubleshooting, and different caching options to improve performance.

## Handling Errors

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0)

Even when an application has a well defined exception management pattern, unhandled exceptions can always sneak through.

Other types of errors can include HTTP status code errors, such as 404-NotFound and 403-Forbidden.  

In this section, we'll go over error handling in both development and production environments, how to introduce a custom status code page, as well as using Exception filters.

### Developer Exception Page

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#developer-exception-page)

### Exception Handler Page

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.0#exception-handler-page)

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

