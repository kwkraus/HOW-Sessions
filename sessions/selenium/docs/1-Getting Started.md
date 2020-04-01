# Getting Started

## What is Selenium?

[Reference Doc](https://selenium.dev/about/)

### Selenium controls web browsers

Selenium is many things but at its core, it is a toolset for web browser automation that uses the best techniques available to remotely control browser instances and emulate a user’s interaction with the browser.

It allows users to simulate common activities performed by end-users; entering text into fields, selecting drop-down values and checking boxes, and clicking links in documents. It also provides many other controls such as mouse movement, arbitrary JavaScript execution, and much more.

Although used primarily for front-end testing of websites, Selenium is at its core a browser user agent library. The interfaces are ubiquitous to their application, which encourages composition with other libraries to suit your purpose.

### One interface to rule them all

One of the project’s guiding principles is to support a common interface for all (major) browser technologies. Web browsers are incredibly complex, highly engineered applications, performing their operations in completely different ways but which frequently look the same while doing so. Even though the text is rendered in the same fonts, the images are displayed in the same place and the links take you to the same destination. What is happening underneath is as different as night and day. Selenium “abstracts” these differences, hiding their details and intricacies from the person writing the code. This allows you to write several lines of code to perform a complicated workflow, but these same lines will execute on Edge, Firefox, Internet Explorer, Chrome, and all other supported browsers.

### Brief History

[Reference Link](https://en.wikipedia.org/wiki/Selenium_(software))

Developed as an internal tool for Thoughtworks, it was open sourced in 2004 and was called Selenium Remote Control (RC).

In 2007, a parallel project within Thoughtworks was being developed called Web Driver.  This new technology was considered superior to Selenium RC. During a meeting at the Google Test Automation converence, it was decided to merge the two projects and rebrand as Selenium WebDriver or Selenium 2.0

## Prerequisites

- Visual Studio 2019 (Latest updates)
  - Ensure LocalDb is installed
- .NET Core 3.X 
- Access to Azure DevOps Organization (can be a personal org)
- Access to Azure Subscription (can be personal subscription, i.e. Visual Studio subscription)
- Access to nuget.com package feed
- Chrome and Firefox browsers
- Dual Monitors (For remote enragements)

## How to get Started

In this session, we'll be using Selenium support in .NET Core.  The solution will consist of three projects:

- **HOW.Selenium.WebApp.Tests.MSTest**:  .NET Core xUnit Project
  - Project that houses all Selenium Tests

- **HOW.Selenium.WebApp.Framework**:  .NET Core Class Library
  - Project that houses all Framework classes that encapuslate all Selenium API calls

- **HOW.Selenium.WebApp**:  ASP.NET Core Web Application (Test Target App)
  - Web Application under test

- **HOW.Selenium.WebApp.Console (Optional)**: .NET Core Console application used to demonstrate the execution of Selenium Tests from within a Console application process

### Nuget Packages

Selenium for .NET Core is distributed through several Nuget Packages.  Here's a list of the packages that will be used during this HOW Session.

#### Selenium Core Libraries

These packages are the core libraries for Selenium API calls and will be consumed from within the `HOW.Selenium.WebApp.Framework` project to abstract away Selenium API calls from test execution.

- [Selenium.WebDriver](https://www.nuget.org/packages/Selenium.WebDriver)
- [Selenium.Support](https://www.nuget.org/packages/Selenium.Support)
- [DotNetSeleniumExtras.WaitHelpers](https://www.nuget.org/packages/DotNetSeleniumExtras.WaitHelpers)

#### Selenium WebDriver distributions

[Reference Link](https://www.selenium.dev/downloads/)

These packages contain the browser specific WebDriver executables necessary to run Selenium API calls and will be consumed by the projects where the tests are composed and executed.  These are 3rd party packages maintained by community members.

- [Selenium.WebDriver.ChromeDriver](https://www.nuget.org/packages/Selenium.WebDriver.ChromeDriver)
- [Selenium.WebDriver.GeckoDriver](https://www.nuget.org/packages/Selenium.WebDriver.GeckoDriver)

> NOTE: These WebDrivers can also be downloaded separately and managed outside of Nuget packages, if desired.

## Create Solution in Azure DevOps

For this session, we will need to store all of the source code we generate within an Azure DevOps Organization.  Each student will need access to an organization or they can create their own Azure DevOps Organization by going to [Azure DevOps](https://dev.azure.com)

Each student will need to create a new Project (with GIT source control) within Azure DevOps.  Once they have cloned the initial Git repo, follow the below steps for creating the project structure.  Make sure to have them commit and push periodically in order to ensure they don't lose their work.  The sessions for creating the build and release pipelines will use the source within the Azure DevOps repo.

Let's start by creating a new solution with the below projects for our session.  If you are using Visual Studio to create these projects, make sure to name your solution different than the initial project you create.    Have a discussion with customer on what tooling they'd like to work with and be consistent during your sessions.

> NOTE: You can allow customer to use any tools they wish if you are comfortable supporting this scenario

### Create a folder

Create a folder to place your solution and project files

 `md HOW-Selenium`

### Create Framework Project

The Framework project is the abstraction layer between test execution and the Selenium API calls.  Pages are represented as Page Objects and encapsulate all data, commands, and behavior for a specific page within the system under test.

- Visual Studio
  - Add new .NET Core 3.x Class Library project using the Visual Studio provided template.
- .NET Core cli
  - `dotnet new sln`
  - `dotnet new classlib --name HOW.Selenium.WebApp.Framework`
   - `dotnet sln add HOW.Selenium.WebApp.Framework\HOW.Selenium.WebApp.Framework.csproj`

#### Add Selenium Core Nuget Packages

Add the following Nuget packages to the `HOW.Selenium.WebApp.Framework` project.

- [Selenium.WebDriver](https://www.nuget.org/packages/Selenium.WebDriver)
  - This package contains the core Selenium WebDriver library that contains the IWebDriver Interface used by all WebDriver implementations.  It also contains the majority of API calls for Selenium

- [Selenium.Support](https://www.nuget.org/packages/Selenium.Support)
  - This package contains support library with out of band API calls that haven't been added to the core Selenium.WebDriver library.

- [DotNetSeleniumExtras.WaitHelpers](https://www.nuget.org/packages/DotNetSeleniumExtras.WaitHelpers)
  - This package contains WaitHelpers for Selenium
  
### Create Test Project

Here we will create a new .NET Core 3.x MSTest Unit Test project called `HOW.Selenium.WebApp.Tests.MSTest`.  All Selenium tests will be composed within an MSTest method, along with configuration and initialization code.

- Visual Studio
  - Add new .NET Core 3.x MSTest project using the Visual Studio provided template.
- .NET Core cli
  - `dotnet new mstest --name HOW.Selenium.WebApp.Tests.MSTest`
  - `dotnet sln add HOW.Selenium.WebApp.Tests.MSTest\HOW.Selenium.WebApp.Tests.MSTest.csproj`

#### Add Project based reference to `HOW.Selenium.WebApp.Framework` project

This test project will consume the Page Objects defined within libary when composing new tests.  

Add a Project based reference to `HOW.Selenium.WebApp.Framework`

#### Add Selenium WebDriver Implementation Nuget Packages

Add the following Nuget packages to the `HOW.Selenium.WebApp.Tests.MSTest` project.  Only use the GA latest version of these packages to match the latest versions of the browsers on your target computer.

- [Selenium.WebDriver.ChromeDriver](https://www.nuget.org/packages/Selenium.WebDriver.ChromeDriver)
  - This package was created and managed by jsakamoto.  Make sure to match the version of package with version of browser.

- [Selenium.WebDriver.GeckoDriver](https://www.nuget.org/packages/Selenium.WebDriver.GeckoDriver)
  - This package was created and managed by jsakamoto.  Make sure to match the version of package with version of browser.

### Create Web Application Project

The Web Application project is the system under test.  We will start with an out of box ASP.NET Core 3.x Razor application and add functionality to support our Selenium testing.

- Visual Studio
  - Add new ASP.NET Core 3.x Razor Web Application project using the Visual Studio provided template.
  - Ensure you select the Individual Account authentication option during creation.  This will include ASP.NET Identity in the project.
- .NET Core cli
  - `dotnet new webapp --name HOW.Selenium.WebApp --auth Individual --use-local-db`
  - `dotnet sln add HOW.Selenium.WebApp\HOW.Selenium.WebApp.csproj`

Default templates enable HTTPS, make sure to trust local certs

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-3.0&tabs=visual-studio#trust-the-aspnet-core-https-development-certificate-on-windows-and-macos)

`dotnet dev-certs https --trust`

