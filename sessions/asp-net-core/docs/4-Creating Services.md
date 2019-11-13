# Creating Services

In this session, we'll learn how to build and use the Services Pattern to abstract away the use of `HowDataContext` from the pages.  We will also implement the Specification Pattern for composing different specifications to query results from Entity Framework Core.

We will build two services, `ProductService` for managing Products, and `AzureStorageService` for saving images to Azure Storage.  All pages will interact with the `ProductService` which will consume the `AzureStorageService` for saving product images.

Concepts focused in this sesssion:

- Interface based programming

- Dependency Injection

- Configuration Management

- Options Pattern

## Create Services Project

First, we need to create a new .NET Core Class Library project and call it `HOW.AspNetCore.Services`.  This project will reference the `HOW.AspNetCore.Data` project and be the only interface for managing product related activities.

### Create the following folders

- **Interfaces**

    We will store all Service interfaces within this folder (e.g. `IStorageService`)

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
