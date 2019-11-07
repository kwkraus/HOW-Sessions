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

Add the following code to the `Startup.cs` file within the `ConfigureServices()` method.

```cs
services.AddDbContext<HowDataContext>(options =>
    options.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=HowAspNetCoreDb;Trusted_Connection=True;MultipleActiveResultSets=true"));
```

### Enable EF Migrations to Create Database

Now we need to create an initial migration that represents the initial database schema and create the database based on this initial migration.

### Run these commands

Create the initial migratoin

- `Add-Migration 'Initial' -project How.AspNetCore.Data`

Create the database with initial schema

- `Update-Database`

### What just happened

[Reference Doc](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=vs)

Briefly discuss what these commands did and how they did it.

- Migration files and where they were created

- EF Core inspected DI container to find DbContext to create migration

- EF Core Update command applies all migrations using configured connectionstring

## Update Products List page with EF Core

We now need to remove the hardcoded list of products within the `Index.cshtml.cs` file and return Products using DbContext.  First we need to do is add a constructor to the `IndexModel` class and have the `HowDataContext` injected into the class

```cs
private readonly HowDataContext _context;

public IndexModel(HowDataContext context)
{
    _context = context;
}
```

Next, remove the hardcoded list of products and pull the Products from the context

```cs
public void OnGet()
{
    Products = _context.Products.ToList();
}
```

>NOTE: when you run the application you will still see one `Product` in the Products list.  This is the item we added within the Razor Page using Razor syntax

### Run application to test

Start the application and navigate to the Products list page.  You should see only one Product.  This is expected because we haven't created any products within the database, and we are still manually adding a product within the Razor Page.

## Add Create Product Page

Next we need to create new Products and save them to our newly created database.

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

### Discuss the Razor Tag Helpers present on this page

  [Reference Doc](https://docs.microsoft.com/en-US/aspnet/core/mvc/views/tag-helpers/intro?view=aspnetcore-3.0)

- Label, Input, Validation

- Tag Helper Scope

- Intellisense Support

### Add Validation

Let's add some validation to the Create page using Entity Data Annotations and see how this affects our page behavior as well as the database schema.

#### Update `Product.cs` Entity

In this example, we'll use DataAnnotations to apply attributes on the Product properties.  These attributes are used by both the ASP.NET Core validation system as well as EF Core's migration system.

```cs
public int Id { get; set; }

[Required]
[StringLength(60, MinimumLength = 3)]
[DisplayName("Product Name")]
public string Name { get; set; }

[Required]
[Range(1, 1000)]
[DataType(DataType.Currency)]
[Column(TypeName = "decimal(18, 2)")]
public decimal Price { get; set; }
```

> Make sure to explain what each attribute does.

#### Update the Index.cshtml Product List page

In order to turn validation on within the cshtml page, you need to add the Validation Scripts at the bottom of the page.

```cs
@section Scripts {
    @{await Html.RenderPartialAsync("_ValidationScriptsPartial");}
}
```

#### Create another EF Core migration

Because we added some DataAnnotation attributes to the Product entity, we need to make sure these changes are also represented within our database schema.  In order to update our database, we need to create a new migration and apply it to the database.

- `Add-Migration 'Validation' -project How.AspNetCore.Data`

Apply the migration changes

- `Update-Database`

> Show the effects of these attributes when the application is running.  Also, make sure to show the changes to the Product table schema.

## Add Edit Product Page

```html
<h1>Edit Product</h1>

<form method="post">
    <div class="form-group">
        <label asp-for="Product.Id" class="control-label"></label>
        <input asp-for="Product.Id" class="form-control" readonly />
    </div>
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
        <input type="submit" value="Update" class="btn btn-primary" />
    </div>
</form>

@section Scripts {
    @{await Html.RenderPartialAsync("_ValidationScriptsPartial");}
}
```

```cs
[BindProperty]
public Product Product { get; set; }

public async Task OnGetAsync(int id)
{
    Product = await _context.Products.FindAsync(id);
}

public async Task<IActionResult> OnPostAsync()
{
    if (!ModelState.IsValid)
        return Page();

    var productToEdit = _context.Products.Find(Product.Id);

    if (productToEdit == null)
        return Page();

    _context.Entry(productToEdit).CurrentValues.SetValues(Product);
    await _context.SaveChangesAsync();

    return RedirectToPage("Index");
}
```

## Add Delete Product Page

```cs
public async Task<IActionResult> OnGetAsync(int id)
{
    var productToDelete = await _context.Products.FindAsync(id);
    _context.Products.Remove(productToDelete);
    await _context.SaveChangesAsync();

    return RedirectToPage("Index");
}
```
