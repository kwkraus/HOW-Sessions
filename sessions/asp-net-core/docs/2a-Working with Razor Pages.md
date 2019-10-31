# Working with Razor Pages

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-3.0&tabs=visual-studio)

In this session, we'll take a look at ASP.NET Core Razor pages and their programming model.  We'll also look at the Razor page syntax for View pages

## What's in Razor Page Template

When you inspect the what is generated from the Visual Studio 2019 ASP.NET Core Razor Page template, discuss the following items:

- Razor Page setup within Startup.cs
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

- Default Page routing

   | File name and path | matching URL |
   | --- | ---:|
   | /Pages/Index.cshtml | / or /Index |
   | /Pages/Contact.cshtml | /Contact |
   | /Pages/Store/Contact.cshtml | /Store/Contact |
   | /Pages/Store/Index.cshtml | /Store or /Store/Index |

- `@page` directive

  - Must be first directive on page. ASP.NET Core treats as it's own MVC Action

- Razor Syntax

   [Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/razor?view=aspnetcore-3.0)

   At a high level, discuss the idea of razor syntax using some of the out of the box pages.  Ability to combine HTML and C#

- `PageModel` class (aka Code Behind)

  - Name must match associated page filename, by convention

- Shared View files

   Discuss the core shared View files

  - `_viewImports.cshtml` applies common directives to all pages
  - `_viewStart.cshtml` attaches the layout page to all pages
  - `Shared\_layout.cshtml` contains the look at feel applied to all pages

## Writing your first page

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/razor?view=aspnetcore-3.0)

Let's create our first Razor pages using Visual Studio.  For this session, we're going to create some pages that will manage Products for a particular company.  We'll add pages to create, edit, and list products.

### List a set of Products page

- Add a new Razor Page to the Pages/Products folder and call it `Index.cshtml`

    >if using dotnet cli:  
    >`dotnet new page --name Create --namespace [TargetNamespace]`

- Open the `Index.cshtml` page and add the following markup

    ```html
    <h1>Products</h1>

    <p>
        <a asp-action="Create">Create New</a>
    </p>
    <table class="table">
        <thead>
            <tr>
                <th>
                    @Html.DisplayNameFor(model => model.Name)
                </th>
                <th>
                    @Html.DisplayNameFor(model => model.Price)
                </th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach (var item in Model)
            {
                <tr>
                    <td>
                        @Html.DisplayFor(modelItem => item.Name)
                    </td>
                    <td>
                        @Html.DisplayFor(modelItem => item.Price)
                    </td>
                    <td>
                        @Html.ActionLink("Edit", "Edit", new { id=item.Id }) |
                        @Html.ActionLink("Details", "Details", new { id=item.Id }) |
                        @Html.ActionLink("Delete", "Delete", new { id=item.Id })
                    </td>
                </tr>
            }
        </tbody>
    </table>

    ```

    > NOTE: Some of the ActionLinks will not work until the pages are created

### Create a new Product page

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
