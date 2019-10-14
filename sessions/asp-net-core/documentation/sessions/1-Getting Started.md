# Getting Started

## Why ASP.NET Core?

[Docs Reference](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-3.0#why-choose-aspnet-core)

Begin the discussion with an overview of why someone would want to use ASP.NET Core over a different technology.

ASP.NET Core provides the following benefits:

- A unified story for building web UI and web APIs.
- Architected for testability.
- Razor Pages makes coding page-focused scenarios easier and more productive.
- Blazor lets you use C# in the browser alongside JavaScript. Share server-side and client-side app      logic all written with .NET.
- Ability to develop and run on Windows, macOS, and Linux.
- Open-source and community-focused.
- Integration of modern, client-side frameworks and development workflows.
- Support for hosting Remote Procedure Call (RPC) services using gRPC.
- A cloud-ready, environment-based configuration system.
- Built-in dependency injection.
- A lightweight, high-performance, and modular HTTP request pipeline.
- Ability to host on the following:
  - Kestrel
  - IIS
  - HTTP.sys
  - Nginx
  - Apache
  - Docker
- Side-by-side versioning.
- Tooling that simplifies modern web development.


## Create New Project

Create a new ASP.NET Core 3.x project using the target tool of choice.  Have a discussion with customer on what tooling they'd like to work with and be consistent during your sessions.

> NOTE: You can allow customer to use any tools they wish if you are comfortable supporting this scenario

- Visual Studio
- .NET Core cli
  - For MVC: `dotnet new mvc '<projectname>'`
  - For Razor Pages: `dotnet new webapp '<projectname>'`

Default templates enable HTTPS, make sure to trust local certs

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-3.0&tabs=visual-studio#trust-the-aspnet-core-https-development-certificate-on-windows-and-macos)

`dotnet dev-certs https --trust`

## ASP.NET Core Fundamentals

With the new project created, we will discuss the main fundamentals of an ASP.NET Core project and its execution.

### The StartUp Class

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/?view=aspnetcore-3.0&tabs=windows#the-startup-class)

ASP.NET Core projects contain a special class called Startup.cs used for the following activities:

- Configure required services
  - Discuss what services are and how to leverage extensions within the `ConfigureServices` method
  - Touch on Dependency Injection: Will be discussed in greater detail in another session.
- Define request handling pipeline
  - Discuss what middleware is and how it works: [ASP.NET Core Middleware](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware/index?view=aspnetcore-3.0)
    - `IApplicationBuilder`
    - Order Matters
    - `Use`, `Run`, `Map`

