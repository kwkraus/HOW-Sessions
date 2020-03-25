# Creating Selenium Tests

In this session, we'll create our first Selenium test, composing the test from our Framework Page Objects.  Every test will inherit from a `TestBase` class that manages the lifetime of the test, including the interactions with the Framework `Driver` class.

## TestBase Class

Every test we create will inherit from a base class called `TestBase.cs`.  This class will be responsible for the initialization and cleanup of resources used during the test, specifically the Framework `Driver` class.

### Create `TestBase.cs` class

Create a new class at the root of the project called `TestBase.cs` and add the following code.

Discussion Points:

- Depending on which Test execution tool you are using, the `TestBase` class will look different based on how each test framework implements lifetime.  In this example, we are using MSTest, where we use the `TestInitialize()` and `TestCleanup()` attributes for lifetime events.

- The `Initialize()` method is responsible for initializing the Framework's Driver class, which is responsible for the runtime configuration of the WebDriver.

- The `Cleanup()` method must always call the Quit() method in order to close the browser session and clean up resources on executing machine.

Here is what the `TestBase` class should look like for MSTest

```csharp
using HOW.Selenium.WebApp.Framework;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace HOW.Selenium.WebApp.Tests.MSTest
{
    public class TestBase
    {

        public TestContext TestContext { get; set; }
              
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
    }
}

```

> NOTE: If you see red squiggly lines under the Driver references, make sure you had added a Project Reference to the `HOW.Selenium.WebApp.Framework` project.

## Runsettings File

[Reference Doc](https://docs.microsoft.com/en-us/visualstudio/test/configure-unit-tests-by-using-a-dot-runsettings-file?view=vs-2019)

MSTest utilizes runsettings to manage the behavior of the test execution engine.  These runsettings also have a configuration section that allows for environment specific configuration to be used.

### Create `dev.runsettings` file

Create a new runsettings file at the root of the test project called `dev.runsettings`.  

> NOTE: you will need to add a file with a known extension, then rename with extension of .runsettings

### Define TestRunParameters

[Reference Doc](https://docs.microsoft.com/en-us/visualstudio/test/configure-unit-tests-by-using-a-dot-runsettings-file?view=vs-2019#testrunparameters)

For this session, the main purpose of the `dev.runsettings` file is to manage configuration options for running Selenium test.  These parameters are stored in a section of the runsettings file called `TestRunParameters`.  This is a list of name/value pairs that can be referenced from within the `TestBase` when executing tests.

Use this link [Example runsettings file](https://docs.microsoft.com/en-us/visualstudio/test/configure-unit-tests-by-using-a-dot-runsettings-file?view=vs-2019#example-runsettings-file) for the students to download an example runsettings file.  It will probably be easiest from them to open browser and search for `"visual studio .runsettings example"`.  You should see a link `"Configure unit tests by using a .runsettings file"` which they can click on and then scroll to the section of the example.

Next update the TargetFrameworkVersion to the following `<TargetFrameworkVersion>FrameworkCore10</TargetFrameworkVersion>`

Replace the existing TestRunParameters node and replace with the following

```xml
<!-- Parameters used by tests at runtime -->
<TestRunParameters>
  <Parameter name="BaseUrl" value="https://localhost:5001" />
  <Parameter name="TargetBrowser" value="Chrome" />
  <Parameter name="isPrivateMode" value="true" />
  <Parameter name="isHeadless" value="false" />
</TestRunParameters>
```

In our example, we default to using the Chrome WebDriver, using incognito mode, with the browser UI visible.

Below is what your `dev.runsettings` file should look like in it's entirety

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

    <!-- Framework35 | [Framework40] | Framework45 | FrameworkCore10 -->
    <TargetFrameworkVersion>FrameworkCore10</TargetFrameworkVersion>

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
    <Parameter name="BaseUrl" value="https://localhost:5001" />
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

> NOTE: Don't forget to select the newly created runsettings file from within the Test menu within Visual Studio in order for them to take effect.

## First Test

Our first test will be a very simple test, but will validate that all of our plumbing is working and allows us to visualize a running test and that our configuration is valid.

### Create `HomePageTests.cs` class

It is common practice to group related tests together within the same file.  Here we will create a new Test class called `HomePageTests.cs` in a folder called **Tests** at the root of the project.

You will need to add a new empty class and update its contents to look like the following.

Discussion Points:

- Mark class as public to ensure tests can execute and be seen by tooling

- Add the `TestClass` attribute to the class, this is required by MSTest

- Add a new method called `HomePage_Navigate_To_Page()` and add the `TestMethod` attribute to this method.  This constitues a "Test" and the name of this method should be descriptive enough to understand what the test is doing in order to make identification and troubleshooting easier.

```csharp
using HOW.Selenium.WebApp.Framework.Pages;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace HOW.Selenium.WebApp.Tests.MSTest.Tests
{
    [TestClass]
    public class HomePageTests : TestBase
    {
        [TestMethod]
        public void HomePage_Navigate_To_Page()
        {
            HomePage.GoTo();

            Assert.IsTrue(HomePage.IsAt);
        }
    }
}
```

### Run your First Test

Before we run our new test, we need to make sure it compiles and we can discover it within Visual Studio Test tooling.

Visual Studio contains a tool called **Test Explorer** that discovers all tests within a loaded solution using the attributes added to the test files.  These tests will only be discovered when the test projects compile successfully.

Open **Test Explorer** and verify that you see our newly created test.  If you see the test, you are ready to run it.

1. Make sure the `HOW.Selenium.WebApp` project is running.  Easiest way to do this is to open a command window, navigate to the WebApp folder, and launch site using dotnet cli using `dotnet run`

2. Ensure you have the `dev.runsettings` file selected within the Test menu of Visual Studio.

3. From within Visual Studio Test Explorer, run the test.  You should see an instance of Chrome open, using incognito mode, load the target web application at https://localhost:5001, then close when done.

### Evaluate Test Execution

Back within the **Test Explorer** window, you should see a green checkmark indicating that the test successfully completed.

If you see a red X, you will need to troubleshoot the issue and rerun the test.

### Running Test in Debug Mode

To illustrate how the test executes, you can run the test in debug mode and set breakpoints to walk through the code.

Make sure you step into each method to see the actual Selenium API calls being used and discuss with students.

## Questions that may come up
