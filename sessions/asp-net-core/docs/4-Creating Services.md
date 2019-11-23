# Creating Services

In this session, we'll learn how to build and use the Services Pattern to abstract away the use of `HowDataContext` from the pages.  We will also implement the Specification Pattern for composing different specifications to query results from Entity Framework Core.

We will build two services, `ProductService` for managing Products, and `AzureStorageService` for saving images to Azure Storage.  All pages will interact with the `ProductService` which will consume the `AzureStorageService` for saving product images.

Concepts focused in this sesssion:

- Interface based programming

- [Dependency Injection](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-3.0#overview-of-dependency-injection)

- [Configuration Management](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-3.0)

- [Options Pattern](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-3.0)

## Dependency Injection Fundamentals

- [Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-3.0#lifetime-and-registration-options)

In order to better understand how to register our new services within ASP.NET Core, we first need to understand lifetime and registration options for types used within the Dependency Injection system.

In order to best demonstrate object lifetimes, we will create an `Operation` class that implements several interfaces used for the different types of registrations.  We will then register an object for each Interface based on a defined lifetime.  

We will also create an `OperationService` class that will ask for these registered interfaces using Dependency Injection.

 Finally, we'll create a Razor Page that also askes for these registered interfaces, as well as the `OperationService` registered type, then display the associated Guid for each injected object to demonstrate lifetime.

### Create Interfaces

First we will create the interfaces that will be used for each lifetime registration within the DI System.  Each interface will implement a "root" interface since each of the implementations are used just as a mechanism for registration purposes.

```cs
public interface IOperation
{
    Guid OperationId { get; }
}

public interface IOperationTransient : IOperation
{
}

public interface IOperationScoped : IOperation
{
}

public interface IOperationSingleton : IOperation
{
}

public interface IOperationSingletonInstance : IOperation
{
}
```

### Create Implementation

Next, we'll create an implementation class that inherits from each of the interfaces.  This allows us to use the same implementation class for each lifetime registration.

```cs
public class Operation : IOperationTransient,
    IOperationScoped,
    IOperationSingleton,
    IOperationSingletonInstance
{
    public Operation() : this(Guid.NewGuid())
    {
    }

    public Operation(Guid id)
    {
        OperationId = id;
    }

    public Guid OperationId { get; private set; }
}
```

### Create Service Implementation

We then create a new `OperationService` class that asks for the registered types for each of the interface lifetimes.

```cs
public class OperationService
{
    public OperationService(
        IOperationTransient transientOperation,
        IOperationScoped scopedOperation,
        IOperationSingleton singletonOperation,
        IOperationSingletonInstance instanceOperation)
    {
        TransientOperation = transientOperation;
        ScopedOperation = scopedOperation;
        SingletonOperation = singletonOperation;
        SingletonInstanceOperation = instanceOperation;
    }

    public IOperationTransient TransientOperation { get; }
    public IOperationScoped ScopedOperation { get; }
    public IOperationSingleton SingletonOperation { get; }
    public IOperationSingletonInstance SingletonInstanceOperation { get; }
}
```

### Create Index page to display results

Finally, we create a new `Index.cshtml` Razor Page that askes for the registered types within the DI System.  The IndexModel class will have these registered types injected into the object to demonstrate that the registered types being injected into the PageModel are the same types as the ones injected into the `OperationService` instance.

The Razor page then displays the Guids for each lifetime object to show the matching/unmatching guid results based on lifetime.

```cs
public class IndexModel : PageModel
{
    public IndexModel(
        OperationService operationService,
        IOperationTransient transientOperation,
        IOperationScoped scopedOperation,
        IOperationSingleton singletonOperation,
        IOperationSingletonInstance singletonInstanceOperation)
    {
        OperationService = operationService;
        TransientOperation = transientOperation;
        ScopedOperation = scopedOperation;
        SingletonOperation = singletonOperation;
        SingletonInstanceOperation = singletonInstanceOperation;
    }

    public OperationService OperationService { get; }
    public IOperationTransient TransientOperation { get; }
    public IOperationScoped ScopedOperation { get; }
    public IOperationSingleton SingletonOperation { get; }
    public IOperationSingletonInstance SingletonInstanceOperation { get; }

    public void OnGet()
    {

    }
}
```

```html
@{
    ViewData["Title"] = "Dependency Injection Sample";
}

<h1>@ViewData["Title"]</h1>

<div class="row">
    <div class="panel panel-default">
        <div class="panel-heading">
            <h2 class="panel-title">Operations</h2>
        </div>
        <div class="panel-body">
            <h3>Page Model Operations</h3>
            <dl>
                <dt>Transient</dt>
                <dd>@Model.TransientOperation.OperationId</dd>
                <dt>Scoped</dt>
                <dd>@Model.ScopedOperation.OperationId</dd>
                <dt>Singleton</dt>
                <dd>@Model.SingletonOperation.OperationId</dd>
                <dt>Instance</dt>
                <dd>@Model.SingletonInstanceOperation.OperationId</dd>
            </dl>
            <h3>OperationService Operations</h3>
            <dl>
                <dt>Transient</dt>
                <dd>@Model.OperationService.TransientOperation.OperationId</dd>
                <dt>Scoped</dt>
                <dd>@Model.OperationService.ScopedOperation.OperationId</dd>
                <dt>Singleton</dt>
                <dd>@Model.OperationService.SingletonOperation.OperationId</dd>
                <dt>Instance</dt>
                <dd>@Model.OperationService.SingletonInstanceOperation.OperationId</dd>
            </dl>
        </div>
    </div>
</div>
```

- Talk about why the SingletonInstance and Singleton registrations have the same guid

- Talk about why the Scoped registrations have the same guids between client requests, but change after each request

- Talk about the transient registration and why the guid changes for each class it's injected into

## Create new `ProductService`

The `ProductService` class will be responsible for abstracting away product behavior, as well as CRUD operation utilizing the `HowDataContext` for data access.

The `ProductService` class will implement a new interface called `IProductService`.  We will use this interface for our DI registration as well as within our Unit test project for mocking dependencies.

### Create Service Project

Now, let's focus on creating our own Service Implementation.  First, we need to create a new .NET Core Class Library project and call it
`HOW.AspNetCore.Services`.  This project will reference the `HOW.AspNetCore.Data` project and be the only interface for managing product related activities.

### Create the following folders

- **Interfaces**

    We will store all Service interfaces within this folder (e.g. `IStorageService` & `IProductService`)

- **Domains**

    Domain specific Services will live here (e.g. `ProductService`)

- **Storage**

    Our Storage Service implementations will live here (e.g. `AzureStorageService`)

### Add Project Reference to Data Project

Make sure to add a reference to the `HOW.AspNetCore.Data` project.  This will provide access to the `HowDataContext` class using Dependency Injection.

## Add our first Service

Our first Service class will be the `ProductService`.  Services encapuslate CRUD and Behavior business logic into a sharable component.

### Create the ProductService class

Add a new public class named `ProductService.cs` within the Domains folder and add the following code.

```cs
private readonly HowDataContext _context;

public ProductService(HowDataContext context)
{
    _context = context;
}

public async Task<IEnumerable<Product>> GetAllProducts()
{
    return await _context.Products.ToListAsync();
}

public async Task<Product> GetProductAsync(int id)
{
    return await _context.Products.FindAsync(id);
}

public async Task UpdateProductAsync(Product product)
{
    if (product == null)
        throw new ArgumentNullException(nameof(product));

    var productToEdit = _context.Products.Find(product.Id);

    if (productToEdit == null)
        throw new ArgumentException($"Product Id={product.Id} was not found");

    _context.Entry(productToEdit).CurrentValues.SetValues(product);
    await _context.SaveChangesAsync();
}

public async Task DeleteProductAsync(int? id)
{
    if (id == null)
        throw new ArgumentNullException(nameof(id));

    var productToDelete = await _context.Products.FindAsync(id);

    if (productToDelete == null)
        throw new ArgumentException($"Product Id={id} was not found");

    _context.Products.Remove(productToDelete);
    await _context.SaveChangesAsync();
}

public async Task<Product> CreateProductAsync(Product product)
{
    var newProduct = _context.Products.Add(product);
    await _context.SaveChangesAsync();
    return newProduct.Entity;
}
```

>This `ProductService` looks a lot like a Repository, but that's because we haven't defined other behaviors or added specific business logic that would reside in a Service class.

You'll notice that we're going to inject the `HowDataContext` into the constructor to use within our service.

### Extract Interface from `ProductService`

[Reference Doc](https://docs.microsoft.com/en-us/visualstudio/ide/reference/extract-interface?view=vs-2019)

Now we will extract an interface from our Service implementation and program to the interface to support decoupling implementation. [SOLID Principals](https://en.wikipedia.org/wiki/SOLID)

When extracting an interface, keep the defaults in the dialog window.  This will create a new interface called `IProductService` within a new file in the same folder as the `ProductService`.  

Make sure you move this interface into the Interfaces folder and update the namespace.

## Refactor Pages to use `ProductService`

In this section, we'll remove the `HowDataContext` and its usage from all Razor Pages and inject our newly created `ProductService` using the `IProductService` interface to program against.

### Add Project reference to `HOW.AspNetCore.Services`

Within the Razor page application, add a project reference to the Services class library.

### Remove `HowDataContext` from PageModel constructors

In our previous session, we injected the `HowDataContext` class into each Product Razor page.  Replace the `HowDataContext` constructor parameter with `IProductService` parameter.

It should look similar to the following

```cs
private readonly IProductService _productSvc;

public CreateModel(IProductService productService)
{
    _productSvc = productService;
}
```

> Make sure to update all of the pages in this fashion.

### Update all Razor Pages to use `IProductService`

Next we need to remove all references to the `HowDataContext` member and replace them with `IProductService` method calls.

### Register the `ProductService` class with DI

In order to use the `ProductService` class when a class is expecting a `IProductService` type, we need to register it with the Dependency Injection System, within the `ConfigureServices()` method.

Add the following line of code to the bottom of the `ConfigureServices()` method.

```cs
services.AddTransient<IProductService, ProductService>();
```

## Run Application

If the solution compiles, run the application and make sure it works exactly the same as it did before.

## Update Web Application with Product Images
