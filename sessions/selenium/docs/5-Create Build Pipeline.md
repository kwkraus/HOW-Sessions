# Create Build Pipeline for Selenium Tests


## Ensure dev.runsettings is available in build output

By default, the `dev.runsettings` file is not set to copy to output directory on successful build.

- In Visual Studio, click on `dev.runsettings` file and go to properties.  change the "Copy to output Directory" setting to "Copy if newer".  this will add file to output where we can use during the release.

## Create Solution in Azure DevOps

For this session, we will need to store all of the source code we generate within an Azure DevOps Organization.  Each student will need access to an organization or they can create their own Azure DevOps Organization by going to [Azure DevOps](https://dev.azure.com)

Each student will need to create a new Project (with GIT source control) within Azure DevOps.  Once they have cloned the initial Git repo, follow the below steps for creating the project structure.  Make sure to have them commit and push periodically in order to ensure they don't lose their work.  The sessions for creating the build and release pipelines will use the source within the Azure DevOps repo.

## Create Pipeline

From within your Azure DevOps project where you stored your source code, let's create a new build pipeline for these tests.

- Select `Pipelines` in the Pipelines area and click `New Pipeline`.  

- When prompted to pick a template, use the classic editor and then choose the 'ASP.NET Core` template.  
  - This template contains 4 dotnet cli tasks and a publish artifacts task, Restore, Build, Test, Publish, Publish Artifact

- Remove the Test task, we do not want to run our Selenium tests in our build pipeline.

 - Select `Pipeline` to setup the agent and parameters needed
   - Select the `Azure Pipelines` Agent Pool
   - Choose one of the windows based agents
   - Parameters should be set to: `**/*.csproj`
   - Projects to Test should be set to: `**/*[Tt]ests/*.csproj`

 - Select the `Restore` task
   - For the Agent pool Select `Azure Pipelines`
   - Choose one of the windows based agents
   - Verify that `Use packages from Nuget.org` is checked

 - Select the `Build` task
   - Arguments should set to: `--configuration $(BuildConfiguration) --output $(build.artifactstagingdirectory)`
   - Choose one of the windows based agents

 - Select the `Publish` task
   - Uncheck the following
      - Publish Web Projects
      - Zip Published Projects
      - Add project folder to published path
   - Arguments should set to: `--configuration $(BuildConfiguration) --output $(build.artifactstagingdirectory)`

 - Select the `Publish Artifact` task
   - Path to published should be set to: `$(build.artifactstagingdirectory)`

 - Select  `Save and Queue` to save you pipeline and start the build task

## Validate Build Output

Verify that `chromedriver.exe` and  `dev.runsettings` are in your resulting artifacts folder


