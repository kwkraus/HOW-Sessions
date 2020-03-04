# Getting Started

## What is Selenium?

[Reference Doc](https://selenium.dev/about/)

### Selenium controls web browsers

Selenium is many things but at its core, it is a toolset for web browser automation that uses the best techniques available to remotely control browser instances and emulate a user’s interaction with the browser.

It allows users to simulate common activities performed by end-users; entering text into fields, selecting drop-down values and checking boxes, and clicking links in documents. It also provides many other controls such as mouse movement, arbitrary JavaScript execution, and much more.

Although used primarily for front-end testing of websites, Selenium is at its core a browser user agent library. The interfaces are ubiquitous to their application, which encourages composition with other libraries to suit your purpose.

### One interface to rule them all

One of the project’s guiding principles is to support a common interface for all (major) browser technologies. Web browsers are incredibly complex, highly engineered applications, performing their operations in completely different ways but which frequently look the same while doing so. Even though the text is rendered in the same fonts, the images are displayed in the same place and the links take you to the same destination. What is happening underneath is as different as night and day. Selenium “abstracts” these differences, hiding their details and intricacies from the person writing the code. This allows you to write several lines of code to perform a complicated workflow, but these same lines will execute on Edge, Firefox, Internet Explorer, Chrome, and all other supported browsers.

## How to get Started

In this session, we'll be using Selenium support in .NET Core.  We will create three projects

- **HOW.Selenium.WebApp.Tests**:  .NET Core xUnit Project
  - Project that houses all Selenium Tests

- **HOW.Selenium.WebApp.Framework**:  .NET Core Class Library
  - Project that houses all Framework classes that encapuslate all Selenium API calls

- **HOW.Selenium.WebApp**:  ASP.NET Core Web Application (Test Target App)
  - Web Application under test



### Nuget Packages

Selenium for .NET Core is distributed through Nuget Packages.  Here's a list of the packages that will be used during this HOW Session.

#### Selenium Core Libraries

- [Selenium.Support](https://www.nuget.org/packages/Selenium.Support)
- [Selenium.WebDriver](https://www.nuget.org/packages/Selenium.WebDriver)

#### Selenium WebDriver distributions

- [Selenium.WebDriver.ChromeDriver](https://www.nuget.org/packages/Selenium.WebDriver.ChromeDriver)
- [Selenium.WebDriver.GeckoDriver](https://www.nuget.org/packages/Selenium.WebDriver.GeckoDriver)

## Create Projects

Create a new .NET Core xUnit 3.x project using the target tool of choice.  Have a discussion with customer on what tooling they'd like to work with and be consistent during your sessions.

> NOTE: You can allow customer to use any tools they wish if you are comfortable supporting this scenario

### Create Test Project

Here we will create a new .NET Core 3.x Class Library project called `HOW.Selenium.WebApp.Framework`.  This project will contain all Page Objects and helper classes used for encapsulating Selenium API calls against the Web Application under test.


- Visual Studio
  - Add new .NET Core 3.x xUnit project using the Visual Studio provided template.
- .NET Core cli
  - `dotnet new xunit 'HOW.Selenium.WebApp.Tests'`


### Create Framework Project

### Create Web Application Project

Default templates enable HTTPS, make sure to trust local certs

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-3.0&tabs=visual-studio#trust-the-aspnet-core-https-development-certificate-on-windows-and-macos)

`dotnet dev-certs https --trust`

