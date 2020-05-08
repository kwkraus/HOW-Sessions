# Run Selenium Tests in Release Pipeline

Now lets go ahead and setup a release pipeline.  Our release pipeline will use the artifacts from our previously created pipelines and run the tests that are in our project.

For this version of session we are going use a local agent on each developers machine to run the tests.   If the future we may update this to run on azure resources.


## Setup and Install Agent

- Download agent
  - Go the organization settings, agenet pools, default

 - Get a PAT
  -  Got to user settings, personal access token

 - Install agent on local machine 
  - First copy the agent to the local machine
  - unzip in to a folder of your choice
  - Run `config.cmd`  Follow the instuctions [Here](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/v2-windows?view=azure-devops)
  - Run `run.com`
  - Verify that agent is showing up in the default pool

## Create Release Pipeline


- PageSource
  - Gets the page source for the webpage.  This is the HTML of the page

### Configure Test Task

[Reference Doc](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-vstest)

This is a video of someone running a test in hosted agent
https://www.youtube.com/watch?v=vTWV1x1lg6Q