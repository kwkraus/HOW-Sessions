# Building the Framework

The framework is a pattern for modeling all actions, behaviors, and data interactions for a specific page within your web application.

It is the abstraction layer over the Selenium APIs to allow easy composition of page interactions from within a test.

## The Driver

The `Driver` class is a wrapper around the Selenium WebDriver interface along with support for managing the WebDriver from within a test.

Different test execution frameworks manage lifetime in different ways.  Depending on which test framework is being used will 

The `Driver` class manages the following:

- `IWebDriver` instance
  - This holds the runtime instance of a target browser WebDriver for API calls.
- `BaseUrl` property
  - This is the base url of the target environment. i.e. Dev, Test, Prod
- `Initialize()` method
  - Method that is called by the test to initialize the `IWebDriver` instance at runtime.
- `Quit()` method
  - Method that is called by the test to cleanup the `IWebDriver instance when a test is completed.

Discussion Points:

1. `Initialize()` method takes two parameters. `isPrivate` turns on/off incognito or private mode on the browser.  `isHeadless` shows/hides the browser UI allowing for non interactive execution of tests.

2. `Quit()` method must be called after a test has been executed.  If `Quit()` is not called, the browser session (UI) will still be active.  All sessions need to be cleaned up after test execution.

3. Each WebDriver implementation takes an `options` class to configure its execution.  Discuss the relevant options associated with `isPrivate` and `isHeadless`.

### Create Driver class

Create a new class at root of `HOW.Selenium.WebApp.Framework` and call it `Driver.cs`.

The following code is what the `Driver.cs` class should look like

```csharp
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using System;

namespace HOW.Selenium.WebApp.Framework
{
    public class Driver
    {
        public static IWebDriver Instance { get; set; }

        public static string BaseUrl { get; set; }

        public static void Initialize(
            string driverType,
            bool isPrivateMode = true,
            bool isHeadless = false)
        {
            switch (driverType)
            {
                case "Chrome":
                    //chrome
                    ChromeDriverService svc = ChromeDriverService.CreateDefaultService();
                    ChromeOptions chromeOptions = new ChromeOptions();
                    if (isPrivateMode)
                        chromeOptions.AddArgument("incognito");

                    if (isHeadless)
                        chromeOptions.AddArgument("headless");

                    Instance = new ChromeDriver(svc, chromeOptions);
                    break;

                case "Firefox":
                    //firefox
                    FirefoxDriverService geckoSvc = FirefoxDriverService.CreateDefaultService();
                    var geckoOptions = new FirefoxOptions
                    {
                        AcceptInsecureCertificates = true
                    };

                    if (isPrivateMode)
                        geckoOptions.AddArgument("-private");

                    if (isHeadless)
                        geckoOptions.AddArgument("-headless");

                    Instance = new FirefoxDriver(geckoSvc, geckoOptions);
                    break;

                default:
                    Instance = new ChromeDriver();
                    break;
            }

            Instance.Manage().Window.Maximize();
            Instance.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
        }

        public static void Quit()
        {
            Instance.Quit();
        }
    }
}
```

## The Page Object

A Page Object is a collection of actions, behaviors, and state specific to one page in the target web application (system under test).

These can include:

- Interactions (Clicks, Drag/Drop, Text Entry, etc.)
- Behaviors (Update Item, Find text on page, Validation)
- State (Data used on page, Random data generation)

Each Page Object is named to represent the name of the page it models.  Large web applications can have hundreds, even thousands, of pages that need to be modeled.  When creating Page Objects, it is recommended to house them in a folder called **Pages** and use subfolders for sections/areas within your applications to avoid namespace issues.

For example:

```bash
...
├── Pages
│   ├── Orders
│   │   ├── IndexPage.cs
│   │   ├── OrderPage.cs
│   │   ├── ReviewOrderPage.cs
│   ├── Users
│   │   ├── IndexPage.cs
│   │   ├── UpdateProfilePage.cs
│   └── partials/template
├── Driver.cs
...
```

### Create first Page Object

The system under test will be an out of the box ASP.NET Core Razor Page application, so our first test will target the loading of the index page and assert that we navigated to the correct page.

#### Create Home Page Object

First we need to create a new class called `HomePage.cs` within a folder called **Pages**.  This Page Object will represent our initial Home page that we land on when we launch the application.

In this version of the Page Object pattern, every Page Object will contain two methods:

- **Goto()**
  - Used to navigate to a routable endpoint for the page
- **IsAt**
  - Property used to identify whether or not the target page was successfully loaded.  Usually an indicator on the rendered page.

Discussion Points:

- For the HomePage class, the routable endpoint will be the root of the web application.  Here we will navigate to the BaseUrl defined in the `Driver` class.  Discuss the `Navigate()` API call.

- To identify that we are at the HomePage and that it has rendered successfully, we will check for the word "Welcome" located within a H1 tag.  Discuss the `FindElement()` API call.

- All methods are marked `static` for a reason.  When composing a test, using static methods makes the composition and readability much more easy.

> NOTE: We touch on a couple of API calls in this section, but a more comprehensive list of core APIs will be discussed in the Advanced session.

Here is what the HomePage Page Object should look like.

```csharp
using OpenQA.Selenium;

namespace HOW.Selenium.WebApp.Framework.Pages
{
    public static class HomePage
    {
        public static void GoTo()
        {
            Driver.Instance.Navigate().GoToUrl($"{Driver.BaseUrl}/");
        }

        public static bool IsAt
        {
            get
            {
                var header = Driver.Instance.FindElement(By.TagName("h1"));

                return (header.Text == "Welcome");
            }
        }
    }
}
```

## Helper Classes

Helper classes are great for centralizing shared functionality for easy access.  In this session, our helper class will have a method for taking screenshots at the current state of the WebDriver UI.  This is very helpful to provide a visual representation of a failure to better troubleshoot issues.

### Create Helper Class

At the root of the project, create a new class called `Helper.cs` and add the following implementation.  This class is only to be used internally within the Framework project.

The helper class should look as follows.
```csharp
using OpenQA.Selenium;
using System;

namespace HOW.Selenium.WebApp.Framework
{
    internal static class Helper
    {
        internal static void TakeScreenShot(IWebDriver driver, string fileName)
        {
            Screenshot ss = ((ITakesScreenshot)driver).GetScreenshot();

            ss.SaveAsFile($"{fileName}-{DateTime.Now:yyyyMMddss}.png", ScreenshotImageFormat.Png);
        }
    }
}
```