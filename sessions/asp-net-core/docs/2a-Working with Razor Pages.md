# Working with Razor Pages

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-3.0&tabs=visual-studio)

In this session, we'll take a look at ASP.NET Core Razor pages and their programming model.  We'll also look at the Razor page syntax for View pages

## What's in Razor Page Template

When you inspect the what is generated from the Visual Studio 2019 ASP.NET Core Razor Page template, discuss the following items:

- Razor Page routing within Startup.cs
  - `ConfigureServices()`

      ```cs
      services.AddRazorPages()
      ```

  - `Configure()`

      ```cs
      app.UseEndpoints(endpoints =>
      {
          endpoints.MapRazorPages();
      });
      ```

- `@page` directive
  - Must be first directive on page. ASP.NET Core treats as it's own MVC Action

- `PageModel` class (aka Code Behind)
  - Name must match associated page filename

- Page routing

## Page Model
