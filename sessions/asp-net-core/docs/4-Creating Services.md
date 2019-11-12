# Creating Services

In this session, we'll learn how to build and use the Services Pattern to abstract away the use of `HowDataContext` from the pages.  We will also implement the Specification Pattern for composing different specifications to query results from Entity Framework Core.

We will build two services, `ProductService` for managing Products, and `AzureStorageService` for saving images to Azure Storage.  All pages will interact with the `ProductService` which will consume the `AzureStorageService` for saving product images.

Concepts focused in this sesssion:

- Interface based programming

- Dependency Injection

- Configuration Management

- Options Pattern

## Create Services Project

First, we need to create a new .NET Core Class Library project and call it `HOW.AspNetCore.Services`
