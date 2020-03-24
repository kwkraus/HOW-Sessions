# Creating Selenium Tests

## Add TestBase Class

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
## Add runsettings File

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

