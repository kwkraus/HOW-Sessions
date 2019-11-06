# Working with Data

In this session, we'll be working with data using Entity Framework Core.  We'll discuss how to utilize the built in Dependency Injection system to inject an EF Context into a `PageModel` for retrieving and saving data.

>This session will teach you the basics of Entity Framework Core, but is not intended to be a comprehensive walkthrough of this technology

## Configure Entity Framework Core

In production ready systems, it is best practice to manage your data access resource within a separate class library.  

First order of business is to create a new .NET Core Class Library project and install the appropriate Entity Framework Core Nuget packages.

### Create new project

- Name the new Class Library Project `HOW.AspNetCore.Data`

Next, we need to do is install some Nuget packages for Entity Framework Core.  We will be working with SQL LocalDb, so we will need the following packages using the cli or Package Manager Console

[Referenc Doc](https://docs.microsoft.com/en-us/ef/core/get-started/install/#net-core-cli)

#### dotnet cli

- `dotnet add package Microsoft.EntityFrameworkCore`

- `dotnet add package Microsoft.EntityFrameworkCore.SqlServer`

#### Package Manager Console

- `Install-Package Microsoft.EntityFrameworkCore`

- `Install-Package Microsoft.EntityFrameworkCore.SqlServer`

> NOTE: you can also use the Nuget Package Manager in Visual Studio to find and install these packages

### Create Product Entity

Create folder called `Entities` at the root of the Data project. Copy the `Product.cs` class from the Asp.Net Core project and save it in this folder.  Make sure to change the namespace.

> Make sure to delete the Entities folder containg the `Product.cs` file from the ASP.NET Core application

### Create DbContext

Create a folder called `Contexts` at the root of the Data project.  Create a new class within this folder and call it `HowDataContext.cs`

Make this class inherit from DbContext, which is part of Entity Framework Core.  Because we'll be using Dependency Injection for configuring this context, we need to make sure to add the constructor that takes a `DbContextOptions<HowDataContext>` parameter.  This will allow the DI container to inject the options at runtime. [Reference Doc](https://docs.microsoft.com/en-us/ef/core/miscellaneous/configuring-dbcontext#using-dbcontext-with-dependency-injection)

Create a public property of type `DbSet<Product>` and call it `Products`

```cs
public class HowDataContext : DbContext
{
    public HowDataContext(DbContextOptions<HowDataContext> options)
      :base(options)
    { }

    public DbSet<Product> Products { get; set; }
}
```

>Don't forget to make sure you create a Project Reference to the new Data project within the ASP.NET Core application

### Register your DbContext using Dependency Injection

[Reference Doc](https://docs.microsoft.com/en-us/ef/core/miscellaneous/configuring-dbcontext#using-dbcontext-with-dependency-injection)

In order to use our new DbContext, we need to register it within the Dependency Injection Services Collection.  We will discuss DI in greater details in a future session.

Add the following code to the `Startup.cs` file within the `ConfigureServices()` method

```cs
services.AddDbContext<HowDataContext>(options =>     options.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=HowAspNetCoreDb;Trusted_Connection=True;MultipleActiveResultSets=true"));
```

## Create a new Product page

- Add a new Razor Page to the Page/Products folder and call it `Create.cshtml`

- Open the `Create.cshtml` page and add the following markup

    ```html
    <h1>Create Product</h1>

    <form method="post">
        <div class="form-group">
            <label asp-for="Product.Name" class="control-label"></label>
            <input asp-for="Product.Name" class="form-control" />
            <span asp-validation-for="Product.Name" class="text-danger"></span>
        </div>
        <div class="form-group">
            <label asp-for="Product.Price" class="control-label"></label>
            <input asp-for="Product.Price" class="form-control" />
            <span asp-validation-for="Product.Price" class="text-danger"></span>
        </div>
        <div class="form-group">
            <input type="submit" value="Save" class="btn btn-primary" />
        </div>
    </form>
    ```

- Discuss the Razor Tag Helpers present on this page

  [Reference Doc](https://docs.microsoft.com/en-US/aspnet/core/mvc/views/tag-helpers/intro?view=aspnetcore-3.0)

  - Label, Input, Validation

  - Tag Helper Scope

  - Intellisense Support

## Update Products List page with EF Core
