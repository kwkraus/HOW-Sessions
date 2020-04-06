# Create Build Pipeline for Selenium Tests

## Create Pipeline

From within your Azure DevOps project where you stored your source code, let's create a new build pipeline for these tests.

- Go to the build pipelines page in Azure DevOps and click "New Pipeline".  

- when prompted to pick a template, use the classic editor and then choose the 'ASP.NET Core` template.  
  - This template contains 4 dotnet cli tasks and a publish artifacts task, Restore, Build, Test, Publish, Publish Artifact

- Remove the Test task, we do not want to run our Selenium tests in our build pipeline.

### Ensure dev.runsettings is available in build output

By default, the `dev.runsettings` file is not set to copy to output directory on successful build.

- In Visual Studio, click on `dev.runsettings` file and go to properties.  change the "Copy to output Directory" setting to "Copy if newer".  this will add file to output where we can use during the release.


## Validate Build Output
