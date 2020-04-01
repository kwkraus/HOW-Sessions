# Create Build Pipeline for Selenium Tests

## Create Pipeline

From within your Azure DevOps project where you stored your source code, let's create a new build pipeline for these tests.

Got to the build pipelines page in Azure DevOps and click New Pipeline.  when prompted to pick a template, use the classic editor and then choose the 'ASP.NET Core` template.  This template contains 4 dotnet cli tasks, Restore, Build, Test, Publish
## Validate Build Output
