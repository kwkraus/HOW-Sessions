# Working with Data

In this session, we'll be working with data using Entity Framework Core.  We'll discuss how to utilize the built in Dependency Injection system to inject an EF Context into a `PageModel` for retrieving and saving data

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
