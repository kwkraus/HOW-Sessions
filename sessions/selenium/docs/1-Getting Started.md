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
- Access to Azure DevOps Organization (can be a personal org)
- Access to Azure Subscription (can be personal subscription, i.e. Visual Studio subscription)
- Access to nuget.com package feed

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

- [Selenium.Support](https://www.nuget.org/packages/Selenium.Support)
- [Selenium.WebDriver](https://www.nuget.org/packages/Selenium.WebDriver)

#### Selenium WebDriver distributions

[Reference Link](https://www.selenium.dev/downloads/)

These packages contain the browser specific WebDriver executables necessary to run Selenium API calls and will be consumed by the projects where the tests are composed and executed.  These are 3rd party packages maintained by community members.

- [Selenium.WebDriver.ChromeDriver](https://www.nuget.org/packages/Selenium.WebDriver.ChromeDriver)
- [Selenium.WebDriver.GeckoDriver](https://www.nuget.org/packages/Selenium.WebDriver.GeckoDriver)

> NOTE: These WebDrivers can also be downloaded separately and managed outside of Nuget packages, if desired.

## Create Project Structure

Let's start by creating a new solution with the below projects for our session.  If you are using Visual Studio to create these projects, make sure to name your solution different than the initial project you create.    Have a discussion with customer on what tooling they'd like to work with and be consistent during your sessions.

> NOTE: You can allow customer to use any tools they wish if you are comfortable supporting this scenario

### Create Framework Project

The Framework project is the astraction layer between test execution and the Selenium API calls.  Pages are represented as Page Objects and encapsulate all data, commands, and behavior for a specific page within the system under test.

- Visual Studio
  - Add new .NET Core 3.x Class Library project using the Visual Studio provided template.
- .NET Core cli
  - `dotnet new classlib --name HOW.Selenium.WebApp.Framework`

#### Add Selenium Core Nuget Packages

Add the following Nuget packages to the `HOW.Selenium.WebApp.Framework` project.

- [Selenium.WebDriver](https://www.nuget.org/packages/Selenium.WebDriver)
  - This package contains the core Selenium WebDriver library that contains the IWebDriver Interface used by all WebDriver implementations.  It also contains the majority of API calls for Selenium

- [Selenium.Support](https://www.nuget.org/packages/Selenium.Support)
  - This package contains support library with out of band API calls that haven't been added to the core Selenium.WebDriver library.

### Create Test Project

Here we will create a new .NET Core 3.x MSTest Unit Test project called `HOW.Selenium.WebApp.Tests.MSTest`.  All Selenium tests will be composed within an MSTest method, along with configuration and initialization code.

- Visual Studio
  - Add new .NET Core 3.x MSTest project using the Visual Studio provided template.
- .NET Core cli
  - `dotnet new mstest --name HOW.Selenium.WebApp.Tests.MSTest`

#### Add Project based reference to `HOW.Selenium.WebApp.Framework` project

This test project will consume the Page Objects defined within libary when composing new tests.  

Add a Project based reference to `HOW.Selenium.WebApp.Framework`

#### Add Selenium WebDriver Implementation Nuget Packages

Add the following Nuget packages to the `HOW.Selenium.WebApp.Tests.MSTest` project.  Only use the GA latest version of these packages to match the latest versions of the browsers on your target computer.

- [Selenium.WebDriver.ChromeDriver](https://www.nuget.org/packages/Selenium.WebDriver.ChromeDriver)
  - This package was created and managed by jsakamoto.  Make sure to match the version of package with version of browser.

- [Selenium.WebDriver.GeckoDriver](https://www.nuget.org/packages/Selenium.WebDriver.GeckoDriver)
  - This package was created and managed by jsakamoto.  Make sure to match the version of package with version of browser.

#### Create Base Class for all Test Classes

Every test we create will inherit from a base class called `TestBase.cs`.  This class will be responsible for the initialization and cleanup of resources used during the test, specifically the Framework `Driver` class.

Create a new class at the root of the project called `TestBase` and add the following code.

```csharp
using HOW.Selenium.WebApp.Framework;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace HOW.Selenium.WebApp.Tests.MSTest
{
    public class TestBase
    {
        //Snippet selbase
        [TestInitialize()]
        public void Initialize()
        {
            Driver.Initialize(
                TestContext.Properties["TargetBrowser"].ToString(),
                bool.Parse(TestContext.Properties["isPrivateMode"].ToString()),
                bool.Parse(TestContext.Properties["isHeadless"].ToString()));
            Driver.BaseUrl = TestContext.Properties["BaseUrl"].ToString();
        }

        [TestCleanup()]
        public void Cleanup()
        {
            Driver.Quit();
        }

        public TestContext TestContext { get; set; }
    }
}

```

#### Create runsettings file for configuration setup

MSTest utilizes runsettings to manage the behavior of the test execution engine.  These runsettings also have a configuration section that allows for environment specific configuration to be used.

Create a new runsettings file called `dev.runsettings` and paste the following code into this empty file.

```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <!-- Configurations that affect the Test Framework -->
  <RunConfiguration>
    <MaxCpuCount>1</MaxCpuCount>
    <!-- Path relative to solution directory -->
    <ResultsDirectory>.\TestResults</ResultsDirectory>

    <!-- [x86] | x64    
      - You can also change it from menu Test, Test Settings, Default Processor Architecture -->
    <TargetPlatform>x86</TargetPlatform>

    <!-- Framework35 | [Framework40] | Framework45 -->
    <TargetFrameworkVersion>Framework45</TargetFrameworkVersion>

    <!-- Path to Test Adapters -->
    <!-- TestAdaptersPaths>%SystemDrive%\Temp\foo;%SystemDrive%\Temp\bar</TestAdaptersPaths -->
  </RunConfiguration>

  <!-- Configurations for data collectors -->
  <DataCollectionRunSettings>
    <DataCollectors>
      <DataCollector friendlyName="Code Coverage" uri="datacollector://Microsoft/CodeCoverage/2.0" assemblyQualifiedName="Microsoft.VisualStudio.Coverage.DynamicCoverageDataCollector, Microsoft.VisualStudio.TraceCollector, Version=11.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a">
        <Configuration>
          <CodeCoverage>
            <ModulePaths>
              <Exclude>
                <ModulePath>.*CPPUnitTestFramework.*</ModulePath>
              </Exclude>
            </ModulePaths>

            <!-- We recommend you do not change the following values: -->
            <UseVerifiableInstrumentation>True</UseVerifiableInstrumentation>
            <AllowLowIntegrityProcesses>True</AllowLowIntegrityProcesses>
            <CollectFromChildProcesses>True</CollectFromChildProcesses>
            <CollectAspDotNet>False</CollectAspDotNet>

          </CodeCoverage>
        </Configuration>
      </DataCollector>

    </DataCollectors>
  </DataCollectionRunSettings>

  <!-- Parameters used by tests at runtime -->
  <TestRunParameters>
    <Parameter name="BaseUrl" value="https://localhost:44310" />
    <Parameter name="TargetBrowser" value="Chrome" />
    <Parameter name="isPrivateMode" value="true" />
    <Parameter name="isHeadless" value="false" />
  </TestRunParameters>

  <!-- Adapter Specific sections -->

  <!-- MSTest adapter -->
  <MSTest>
    <MapInconclusiveToFailed>True</MapInconclusiveToFailed>
    <CaptureTraceOutput>false</CaptureTraceOutput>
    <DeleteDeploymentDirectoryAfterTestRunIsComplete>False</DeleteDeploymentDirectoryAfterTestRunIsComplete>
    <DeploymentEnabled>True</DeploymentEnabled>
  </MSTest>

</RunSettings>
```


### Create Web Application Project

The Web Application project is the system under test.  We will start with an out of box ASP.NET Core 3.x Razor application and add functionality to support our Selenium testing.

- Visual Studio
  - Add new ASP.NET Core 3.x Razor Web Application project using the Visual Studio provided template.
  - Ensure you select the Individual Account authentication option during creation.  This will include ASP.NET Identity in the project.
- .NET Core cli
  - `dotnet new webapp --name HOW.Selenium.WebApp --auth Individual --use-local-db`

Default templates enable HTTPS, make sure to trust local certs

[Reference Doc](https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-3.0&tabs=visual-studio#trust-the-aspnet-core-https-development-certificate-on-windows-and-macos)

`dotnet dev-certs https --trust`

