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

## Helper Classes
