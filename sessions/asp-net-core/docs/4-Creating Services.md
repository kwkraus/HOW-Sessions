# Creating Services in ASP.NET Core

In this session, we'll learn how to build and use the Services Pattern to abstract away the use of `HowDataContext` from the pages.

We will build two services, `ProductService` for managing Products, and `AzureStorageService` for saving images to Azure Storage.  All pages will interact with the `ProductService` which will consume the `AzureStorageService` for saving product images.

Concepts for this sesssion:

- Interface based programming

- [Dependency Injection](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-3.0#overview-of-dependency-injection)

- [Configuration Management](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-3.0)

- [Options Pattern](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-3.0)

## Visual Studio Project for Services

In the coming sections, we'll be creating new services and we need a good place to house these new resources.  Not only will we have an implementation class for each service, we'll also need to create interfaces for these implementations.

### Create Service Project

From within Visual Studio, create a new .NET Core Class Library project and call it
`HOW.AspNetCore.Services`.  This project will reference the `HOW.AspNetCore.Data` project and be the only API for managing product related activities.

### Create the following folders

- **Interfaces**

    We will store all Service interfaces within this folder

- **Domains**

    Domain specific Services will live here (e.g. `ProductService`)

- **Storage**

    Our Storage Service implementations will live here (e.g. `AzureStorageService`)

### Add Project Reference to Data Project

Make sure to add a reference to the `HOW.AspNetCore.Data` project.  This will provide access to the `HowDataContext` class using Dependency Injection.

## Dependency Injection Fundamentals

- [Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-3.0#lifetime-and-registration-options)

Before we create our new services, first we need a good example to help explain how Dependency Injection works within ASP.NET Core, such as  lifetime and registration options for types used within the Dependency Injection system.

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

## Create new Service for managing Products

Our first Service class will be the `ProductService`.  Services encapuslate CRUD and Behavior business logic into a sharable component.

### Add new `ProductService` class

Add a new public class named `ProductService.cs` within the Domains folder and add the following code.

```cs
public class ProductService
{
    private readonly HowDataContext _context;

    public ProductService(HowDataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
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
}
```

>This `ProductService` looks a lot like a Repository, but that's because we haven't defined other behaviors or added specific business logic that would reside in a Service class.

Make sure to point out that we're going to inject the `HowDataContext` into the constructor to use within our service.

### Extract Interface from `ProductService`

[Reference Doc](https://docs.microsoft.com/en-us/visualstudio/ide/reference/extract-interface?view=vs-2019)

Now we will extract an interface from our Service implementation and program to the interface to support decoupling implementation. [SOLID Principals](https://en.wikipedia.org/wiki/SOLID)

When extracting an interface, keep the defaults in the dialog window.  This will create a new interface called `IProductService` within a new file in the same folder as the `ProductService`.  

Make sure you move this interface into the **Interfaces** folder and update the namespace.

Your interface should look similar to this example

```cs
public interface IProductService
{
    Task<Product> CreateProductAsync(Product product);
    Task DeleteProductAsync(int? id);
    Task<Product> GetProductAsync(int id);
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task UpdateProductAsync(Product product);
}
```

## Update ASP.NET Core application to use `ProductService`

In this section, we'll remove the `HowDataContext` and its usage from all Razor Pages and inject our newly created `ProductService` using the `IProductService` interface to program against.

### Add Project reference to `HOW.AspNetCore.Services`

Within the Razor page application, add a project reference to the Services class library.

### Refactor PageModel constructors to use `ProductService`

In our previous session, we injected the `HowDataContext` class into each Product Razor page.  For each Razor page, replace the `HowDataContext` constructor parameter with an `IProductService` parameter.

It should look similar to the following:

```cs
private readonly IProductService _productSvc;

public CreateModel(IProductService productService)
{
    _productSvc = productService;
}
```

> Make sure to update all of the pages in this fashion.

#### Update all Razor Pages to use `IProductService`

Next we need to remove all references to the `HowDataContext` private member and replace them with `IProductService` method calls.

For each Razor Page, remove the `_context` references and replace with `_productSvc` API calls.  

### Register the `ProductService` class with DI

In order to use the `ProductService` class when a class is expecting a `IProductService` type, we need to register it with the Dependency Injection System, within the `ConfigureServices()` method.

Add the following line of code to the bottom of the `ConfigureServices()` method.

```cs
services.AddScoped<IProductService, ProductService>();
```

### Run Application

If the solution compiles, run the application and make sure it works exactly the same as it did before.

## Add Images to Products

In this section, we will introduce a new feature to upload a photo of a product.  This feature will be implemented using a new service called `AzureBlobService`.  This service will demonstrate some new concepts around the new .NET Core Configuration system and reinforce what we learned about Dependency Injection.

Concepts in this Section:

- Dependency Injection

- Configuration System

- Options Pattern

We will also utilize the following free downloads for emulating Azure Storage on your local machine.

- [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator)

- [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)

### Add Image Support to Products

In order to support product images, we need to add some new fields to the Product Entity, create a new EF Core migration to update the underlying database, and update the associated Razor Pages to be able to add, update, and delete product images associated with product data.

#### Update Product Entity

Open the `Product.cs` entity class and add the following to the end of the class

```cs
[DisplayName("Image")]
public string ImageLocation { get; set; }

[NotMapped]
public IFormFile Image { get; set; }
```

The `ImageLocation` property will translate to a new column within the Product Table and will hold the location where the Product Image is stored within Azure Storage (Emulator).

The `Image` property is a unmapped property that is just a container for holding the binary image data during page requests.

#### Update Product table in Database

Create a new EF Core migration for Product Images and update the underlying database with new Image support.  Run the following commands from the Package Manager Console.

`Add-Migration 'ProductImage' -project HOW.AspNetCore.Data`

`Update-Database`

#### Update Razor Pages to support Product Images

Now we need to update all Product Razor Pages to enable the new Image support. To do this we need to add `multipart/form-data` support to the html form and a new field to the form that supports file upload.

Add the following code blocks to the associated cshtml pages.

- Create.cshtml

    ```html
    <form method="post" enctype="multipart/form-data">
        <div asp-validation-summary="ModelOnly" class="text-danger"></div>
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
            <label asp-for="Product.Image" class="control-label"></label>
            <input asp-for="Product.Image" class="form-control" />
            <span asp-validation-for="Product.Image" class="text-danger"></span>
        </div>
        <div class="form-group">
            <input type="submit" value="Create" class="btn btn-primary" />
        </div>
    </form>
    ```

- Edit.cshtml

    ```html
    <form method="post" enctype="multipart/form-data">
        <div asp-validation-summary="ModelOnly" class="text-danger"></div>
        <input type="hidden" asp-for="Product.Id" />
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
            <label asp-for="Product.Image" class="control-label"></label>
            <input asp-for="Product.Image" class="form-control" />
            <span asp-validation-for="Product.Image" class="text-danger"></span>
        </div>
        <div class="form-group">
            <input type="hidden" asp-for="Product.ImageLocation" />
            <input type="submit" value="Save" class="btn btn-primary" />
        </div>
    </form>
    ```

    >NOTE: Notice the `hidden` input field for the `Product.ImageLocation` property

- Details.cshtml

    ```html
    <dl class="row">
        <dt class="col-sm-2">
            @Html.DisplayNameFor(model => model.Product.Name)
        </dt>
        <dd class="col-sm-10">
            @Html.DisplayFor(model => model.Product.Name)
        </dd>
        <dt class="col-sm-2">
            @Html.DisplayNameFor(model => model.Product.Price)
        </dt>
        <dd class="col-sm-10">
            @Html.DisplayFor(model => model.Product.Price)
        </dd>
        <dt class="col-sm-2">
            @Html.DisplayNameFor(model => model.Product.ImageLocation)
        </dt>
        <dd class="col-sm-10">
            <img src="@Model.Product.ImageLocation" />
        </dd>
    </dl>
    ```

    >NOTE: The image will be rendered using the Azure Storage location Uri saved within the database.  Make sure to use Product Images that are smaller in dimensions to ensure the page looks nice.

### Create new `AzureBlobService` class

In order to store and manage Images in a Cloud ready application, we need to utilize Cloud based storage systems, such as Azure Blob Storage.

We need to create a new service class called `AzureBlobStorage` within the `HOW.AspNetCore.Services` project within the folder called **Storage**.

It is best to live code the `AzureBlobService` implementation shown below, but if under time constraints, you can copy and paste the following implementation.

```cs
using HOW.AspNetCore.Services.Interfaces;
using HOW.AspNetCore.Services.Options;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.IO;
using System.Threading.Tasks;

namespace HOW.AspNetCore.Services.Storage
{
    public class AzureBlobService
    {
        // Parse the connection string and return a reference to the storage account.
        private readonly CloudStorageAccount _storageAccount;
        private readonly AzureBlobServiceOptions _options;

        public AzureBlobService(IOptionsMonitor<AzureBlobServiceOptions> options)
        {
            _options = options.CurrentValue;
            _storageAccount = CloudStorageAccount.Parse(_options.ConnectionString);
        }

        public async Task<Uri> SaveFileAsync(Stream fileStream, string fileName)
        {
            CloudBlobClient blobClient = _storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference(_options.TargetContainer.ToLower());

            var options = new BlobRequestOptions();

            // Create the container if it doesn't already exist. Set Public access to container and blobs
            await container.CreateIfNotExistsAsync(BlobContainerPublicAccessType.Container, options, new OperationContext());

            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);
            await blockBlob.UploadFromStreamAsync(fileStream, fileStream.Length);

            return blockBlob.Uri;
        }

        public async Task<Uri> SaveFileAsync(byte[] fileContents, string fileName)
        {
            CloudBlobClient blobClient = _storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference(_options.TargetContainer.ToLower());

            // Create the container if it doesn't already exist.
            await container.CreateIfNotExistsAsync();

            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);
            await blockBlob.UploadFromByteArrayAsync(fileContents, 0, fileContents.Length);

            return blockBlob.Uri;
        }

        public async Task RemoveFileAsync(string blobUrl)
        {
            CloudBlobClient blobClient = _storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference(_options.TargetContainer.ToLower());

            Uri fileLocation = new Uri(blobUrl);
            string fileToDelete = Path.GetFileName(fileLocation.LocalPath);

            await container.GetBlobReference(fileToDelete).DeleteIfExistsAsync();
        }

        public async Task<Stream> GetFileAsStreamAsync(string fileName)
        {
            CloudBlobClient blobClient = _storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference(_options.TargetContainer.ToLower());

            MemoryStream outputStream = new MemoryStream();
            await container.GetBlobReference(fileName).DownloadToStreamAsync(outputStream);
            return outputStream;
        }

        public async Task<byte[]> GetFileAsByteArrayAsync(string fileName)
        {
            CloudBlobClient blobClient = _storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference(_options.TargetContainer.ToLower());

            byte[] fileBytes = new byte[4096];

            await container.GetBlobReference(fileName).DownloadToByteArrayAsync(fileBytes, 0);
            return fileBytes;
        }

        private async Task<string> GenerateSASTokenAsync(Uri docUri)
        {
            CloudBlobClient blobClient = _storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference(_options.TargetContainer.ToLower());

            BlobContainerPermissions permissions = new BlobContainerPermissions
            {
                PublicAccess = BlobContainerPublicAccessType.Off
            };

            permissions.SharedAccessPolicies.Clear();
            permissions.SharedAccessPolicies.Add("twominutepolicy", new SharedAccessBlobPolicy());
            await container.SetPermissionsAsync(permissions);

            SharedAccessBlobPolicy sharedPolicy = new SharedAccessBlobPolicy()
            {
                SharedAccessStartTime = DateTime.UtcNow.AddMinutes(-1),
                SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(2),
                Permissions = SharedAccessBlobPermissions.Read
            };

            CloudBlockBlob blob = container.GetBlockBlobReference(docUri.ToString());

            return blob.GetSharedAccessSignature(sharedPolicy, "twominutepolicy");
        }
    }
}
```

>NOTE: This implementation requires follow-on work in order to compile

#### Add Azure Storage Nuget Package

Open the Nuget Package Manager within Visual Studio and add the latest version of the `WindowsAzure.Storage` package

__or__

run the following dotnet cli command

`dotnet add package WindowsAzure.Storage`

__or__

run the following command within the Package Manager Console

`Install-Package WindowsAzure.Storage`

#### Extract Interface from Implemenation

We will need to extract a new Interface from this implementation and use this interface to register a new service within Dependency Injection System.

Using the Visual Studio refactoring tools, extract an Interface using the contextual menu and call it `IStorageService.cs` and save it into a folder called **Interfaces**.

### Setup configuration for `AzureBlobService`

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-3.0)

In this section we'll introduce the Options Pattern to map configuration sections to POCO classes.  We'll create a new class called `AzureBlobServiceOptions` and then register this type with Dependency Injection in order to have it injected into the `AzureBlobService` using `IOptionsMonitor<>`.

#### Options Pattern Fundamentals

Before creating our own Options class for configuring the `AzureBlobService` class, it is appropriate to first discuss the fundamentals of how the Options Pattern works and the different scenarios.

- OptionsMonitor<>

- Named Options

- OptionsSnapshot<>

#### Create Options Class

Create a new class called `AzureBlobServiceOptions` within a new folder called **Options** within the `HOW.AspNetCore.Services` project and add the following code.

```cs
public class AzureBlobServiceOptions
{
    public string ConnectionString { get; set; }
    public string TargetContainer { get; set; }
}
```

### Update `ProductService` class to utilize `AzureBlobService`

#### Update constructor to inject new `IStorageService`

```cs
private readonly IStorageService _storageService;

public ProductService(HowDataContext context, IStorageService storageSvc)
{
    _context = context;
    _storageService = storageSvc;
}
```

#### Update CreateProductAsync Method

```cs
public async Task<Product> CreateProductAsync(Product product)
{
    var newProduct = await _context.Products.AddAsync(product);
    await _context.SaveChangesAsync();

    if (product.Image != null)
    {
        var imageLocation = await SaveFileToStorageAsync(product);

        newProduct.Entity.ImageLocation = imageLocation.ToString();
        await _context.SaveChangesAsync();
    }

    return newProduct.Entity;
}
```

#### Update UpdateProductAsync Method

```cs
public async Task UpdateProductAsync(Product product)
{
    if (product == null)
        throw new ArgumentNullException(nameof(product));

    var productToEdit = await _context.Products.FindAsync(product.Id);

    if (productToEdit == null)
        throw new ArgumentException($"Product Id={product.Id} was not found");

    _context.Entry(productToEdit).CurrentValues.SetValues(product);
    await _context.SaveChangesAsync();

    if (product.Image != null)
    {
        var imageLocation = await SaveFileToStorageAsync(product);

        productToEdit.ImageLocation = imageLocation.ToString();
        await _context.SaveChangesAsync();
    }
}
```

#### Update DeleteProductAsync Method

```cs
public async Task DeleteProductAsync(int? id)
{
    if (id == null)
        throw new ArgumentNullException(nameof(id));

    var productToDelete = await _context.Products.FindAsync(id);

    if (productToDelete == null)
        throw new ArgumentException($"Product Id={id} was not found");

    await _storageService.RemoveFileAsync(productToDelete.ImageLocation);

    _context.Products.Remove(productToDelete);
    await _context.SaveChangesAsync();
}
```

### Register `AzureBlobService` with DI System

In order to use our new `AzureBlobService` class within the `ProductService` we need to register the type with the Dependency Injection system.

Add the following line of code to the `Startup.cs` class within the `ConfigureServices()` method.

```cs
services.AddTransient<IStorageService, AzureBlobStorage>();
```

#### Register `AzureBlobServiceOptions` class with DI System

Add the following code to the `Startup.cs` file within the `ConfigureServices()` method

```cs
services.Configure<AzureBlobServiceOptions>(Configuration.GetSection("AzureBlobStorage"));
```

### Run Application with `AzureBlobService` to test

Now let's see it all run together.  In order to run the application, follow these steps.

- Add Storage connection string to config file

- Run Azure Storage Emulator locally

- Run application and enter a brand new product with an image to upload.
