# Advanced Testing Concepts

## Interacting with Pages and Elements

Selenium has several different API calls that allow a test to access the source of a page, title for a page, and any elements loaded into the Document Object Model (DOM).  

In this section, we'll create several tests demonstrating different API calls to manipulate and verify page data and behavior.

### PageSource and Title

There are some properties that are set for the current state of the WebDriver that are useful in verification tests.  

- PageSource
  - Gets the page source for the webpage.  This is the HTML of the page

- Title
  - Gets the Title for the page.  This is the text you see within the Title of the browser tab.

It is recommended to be as specific as possible when searching for text on a page and attempt to locate text within a specific element on the page, but there are times when checking the entire page source is the easiest method for verifying text present.

Using the `HomePage` Page Object, let's add a couple of new methods that will check for specific text within the page and the page title.

Add the following two methods to the bottom of the class

```csharp
public static bool IsTextPresent(string textToLocate)
{
    return Driver.Instance.PageSource.Contains(textToLocate);
}
```

```csharp
public static bool IsTitleValid(string expectedPageTitle)
{
    return (expectedPageTitle == Driver.Instance.Title);
}
```

Now let's create two new tests that will consume each of these new methods to assert we have a valid Title for the page.

Discussion Points:

- PageSource is a catch all method to determine if a string of text can be found on the page, but it is non-specific.  The text could be part of the html, css, or javascript, making this method less deterministic

- If an application has some template for their Page Title names, the Title property will come in handy.

```csharp
[TestMethod]
public void HomePage_Verify_Title_Using_Source()
{
    var expectedTitle = "Home page";

    HomePage.GoTo();

    Assert.IsTrue(HomePage.IsTextPresent(expectedTitle));
}

[TestMethod]
public void HomePage_Verify_Title_Using_TitleProp()
{
    var expectedTitle = "Home page - HOW.Selenium.WebApp";

    HomePage.GoTo();

    Assert.IsTrue(HomePage.IsTitleValid(expectedTitle));
}
```

Compile the solution and run the new tests to verify that they work.

> NOTE: If you wish, you can change the text and rerun to demonstrate a failure.

### Clicking Links/Buttons

Some of the most common elements on a web page are links and buttons.  Many tests rely on these elements being clicked in order to validate the state of the page.

In this section, we'll create a test to find an element that can be clicked, then verify that the click was successful.

Continuing with the HomePage Page Object, let's create an action method that clicks a navigation link then verify that the browser navigated to the expected page.  

In order to do this we'll need a new Page Object for the expected navigation location.

#### Create `PrivacyPage` Page Object

Within the `HOW.Selenium.WebApp.Framework` project, create a new class called `PrivacyPage.cs` within the **Pages** folder.  Add the following code to this file.

> NOTE: The students can copy and paste the `GoTo()` and `IsAt` members from the `HomePage` and update each with the following.

```csharp
using OpenQA.Selenium;

namespace HOW.Selenium.WebApp.Framework.Pages
{
    public class PrivacyPage
    {
        public static void GoTo()
        {
            Driver.Instance.Navigate().GoToUrl($"{Driver.BaseUrl}/Privacy");
        }

        public static bool IsAt
        {
            get
            {
                var header = Driver.Instance.FindElement(By.TagName("h1"));

                return (header.Text == "Privacy Policy");
            }
        }
    }
}
```

#### Update `HomePage` with Action Method

Now let's open the `HomePage` Page Object and add a new action method called `ClickPrivacyLink()`.  This method will represent the action of clicking the "Privacy" link in the page navigation.

```csharp
public static void ClickPrivacyLink()
{
    var linkText = "Privacy";

    try
    {
        Driver.Instance.FindElement(By.LinkText(linkText)).Click();
    }
    catch(NoSuchElementException nseex)
    {
        throw new ApplicationException($"Failed to find link with text={linkText}", nseex);
    }
}
```

#### Create `HomePage_Navigate_To_PrivacyPage` Test To Click Link

Next, we'll create a new test to test clicking the Privacy Link.

Within the `HOW.Selenium.WebApp.Tests.MSTest` project, open the `HomePageTests` class and add the following new test to the bottom of the class

```csharp
[TestMethod]
public void HomePage_Navigate_To_PrivacyPage()
{
    HomePage.GoTo();

    HomePage.ClickPrivacyLink();

    Assert.IsTrue(PrivacyPage.IsAt, "Failed to navigate to Privacy Page");
}
```

Compile the code and run the new test to verify it works.

### Managing Data

In this section, we will create a test that passes in data to the Page Object in order to interact with the webpage.  For this example, we'll simulate logging into the website using known user credentials.

We must first create a new user within the web application's credential store, but registering a new user from the "Register" link on the Home Page.  This web application utilizes ASP.NET Identity and LocalDb.  The first time you attempt to access the database, you will be prompted to run the **initial migration** script.  Make sure you click the button and refresh the screen when done.

Next, click the "Register" button in the navigation and enter the following credentials

- **Username** = "a@a.com"
- **Password** = "Pass@word1"

After clicking the Register button, you'll also need to confirm the registration in order to log in with these credentials.  This step just sets a flag in user table that they are a valid user.

Once you have successfully registered, click the "Login" button in the upper right navigation and login with new credentials to make sure you can login successfully.

#### Create `LoginPage` Page Object

Now that we have new credentials for our system under test, we need to create a new Page Object called `LoginPage` that will model the login page functionality.

Within the `HOW.Selenium.WebApp.Framework` project, create a new class called `LoginPage` within the **Pages** folder.  Add the following code to this class

```csharp
using OpenQA.Selenium;

namespace HOW.Selenium.WebApp.Framework.Pages
{
    public class LoginPage
    {
        public static void GoTo()
        {
            Driver.Instance.Navigate().GoToUrl($"{Driver.BaseUrl}/Identity/Account/Login");
        }

        public static bool IsAt
        {
            get
            {
                var header = Driver.Instance.FindElement(By.TagName("h1"));

                return (header.Text == "Log in");
            }
        }
    }
}
```

Next, we'll create a new behavior method called `Login()` that accepts two parameters for the username and password.  This will be called by a test to log into the application using provided credentials.

Add the following method to the bottom of the `LoginPage` Page Object.

```csharp
public static void Login(string userName, string password)
{
    var loginElement = Driver.Instance.FindElement(By.Id("Input_Email"));
    loginElement.Clear();
    loginElement.SendKeys(userName);

    Driver.Instance.FindElement(By.Id("Input_Password")).SendKeys(password);

    loginElement.Submit();
}
```

#### Create `LoginPageTests` class

Create a new test class called `LoginPageTests` within the **Tests** folder within the `HOW.Selenium.WebApp.Tests.MSTest` project.

Add a new test called `LoginPage_Attempt_Successful_Login()` and add the following implementation

```csharp
using HOW.Selenium.WebApp.Framework.Pages;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace HOW.Selenium.WebApp.Tests.MSTest.Tests
{
    [TestClass]
    public class LoginPageTests : TestBase
    {
        [TestMethod]
        public void LoginPage_Attempt_Successful_Login()
        {
            LoginPage.GoTo();
            LoginPage.Login("a@a.com", "Pass@word1");
            Assert.IsTrue(HomePage.IsAt, "Failed to Login and redirect to HomePage");
        }
    }
}
```

Compile the projects and run the test to verify that it works.  

> NOTE: These tests can run fast, if you'd like to slow down the test for visualization purposes, add a strategic `Thread.Sleep()` here and there to demonstrate.

### Validation

For a more detailed example, we will need to make some additions to the `HOW.Selenium.WebApp` project that can only be accessed by authenticated users.  This will allow us to compose a more elaborate set of tests with validation.

We will create the following:

- New Request Page that can only be accessed by authenticated users

- Updated navigation to show/hide link to request page

- New RequestPage Page Object to model our new page

- New tests for demonstrating validation

#### Create Request Page for Testing

- Create a new Razor page called **Request** in the **Pages** folder within the `HOW.Selenium.WebApp` project.

  - Use Visual Studio's __Razor Page__ scaffolded template.

  - Add the `[Authorize]` attribute to the PageModel class to ensure they can only be rendered by authenticated users.

  - Copy/Paste html into new `Request.cshtml` page

    ```html
    @page
    @model HOW.Selenium.WebApp.Pages.RequestModel
    @{
        ViewData["Title"] = "Request";
    }

    <h1>Request</h1>
    <hr />
    <div class="row">
        <div class="col-md-4">
            <form method="post" asp-page="Index">
                <div asp-validation-summary="ModelOnly" class="text-danger"></div>
                <div class="form-group">
                    <label asp-for="Title" class="control-label"></label>
                    <input asp-for="Title" class="form-control" />
                </div>
                <div class="form-group">
                    <label asp-for="Body" class="control-label"></label>
                    <input asp-for="Body" class="form-control" />
                </div>
                <div class="form-group">
                    <input id="Create_Request" type="submit" value="Create" class="btn btn-primary" />
                </div>
            </form>
        </div>
    </div>
    ```

- Add access to the Request page within the layout template navigation section.

  - `_Layout.cshtml`

    ```html
    @inject SignInManager<IdentityUser> SignInManager
    @inject UserManager<IdentityUser> UserManager

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>@ViewData["Title"] - HOW.Selenium.WebApp</title>
        <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="~/css/site.css" />
    </head>
    <body>
        <header>
            <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div class="container">
                    <a class="navbar-brand" asp-area="" asp-page="/Index">HOW.Selenium.WebApp</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
                        <partial name="_LoginPartial" />
                        <ul class="navbar-nav flex-grow-1">
                            <li class="nav-item">
                                <a class="nav-link text-dark" asp-area="" asp-page="/Index">Home</a>
                            </li>
                            @if (SignInManager.IsSignedIn(User))
                            {
                            <li class="nav-item">
                                <a class="nav-link text-dark" asp-area="" asp-page="/Request">New Request</a>
                            </li>
                            }
                            <li class="nav-item">
                                <a class="nav-link text-dark" asp-area="" asp-page="/Privacy">Privacy</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
        <div class="container">
            <main role="main" class="pb-3">
                @RenderBody()
            </main>
        </div>

        <footer class="border-top footer text-muted">
            <div class="container">
                &copy; 2020 - HOW.Selenium.WebApp - <a asp-area="" asp-page="/Privacy">Privacy</a>
            </div>
        </footer>

        <script src="~/lib/jquery/dist/jquery.min.js"></script>
        <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="~/js/site.js" asp-append-version="true"></script>

        @RenderSection("Scripts", required: false)
    </body>
    </html>
    ```

Run the application, login and verify that the "New Request" link is visible and that you can open the Request page.

#### Create Request Page Object

- Create a new class in the **Pages** folder called `RequestPage.cs` within the `HOW.Selenium.WebApp.Framework` project.

  Add the following code

    ```csharp
    using OpenQA.Selenium;
    using OpenQA.Selenium.Support.UI;
    using System;

    namespace HOW.Selenium.WebApp.Framework.Pages
    {
        public class RequestPage
        {
            public static void GoTo()
            {
                Driver.Instance.Navigate().GoToUrl($"{Driver.BaseUrl}/Request");
            }

            public static bool IsAt
            {
                get
                {
                    var header = Driver.Instance.FindElement(By.TagName("h1"));

                    return (header.Text == "Request");
                }
            }

            public static void SubmitRequest(string title, string body)
            {
                Driver.Instance.FindElement(By.Id("Title")).SendKeys(title);
                Driver.Instance.FindElement(By.Id("Body")).SendKeys(body);

                new WebDriverWait(Driver.Instance, new TimeSpan(0, 0, 5))
                    .Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.Id("Create_Request"))).Click();
            }
        }
    }
    ```

    > NOTE: Discuss the `WebDriverWait` object and how it is the recommended method for observability into the virtual DOM.

#### Additions to HomePage Page Object

Because we want to check navigation links when we are on the HomePage, let's add a new method to the Page Object to check if links with specific names exist.

- Add a new validation method called `IsNavLinkPresent()` to the HomePage Page Object Class.

    ```csharp
    public static bool IsNavLinkPresent(string linkText)
    {
        var links = Driver.Instance.FindElements(By.LinkText(linkText));

        return (links.Count > 0);
    }
    ```

#### Create RequestPage Tests

In this section, we'll create a couple of new tests and store them in a new Test Class called `RequestPageTests` within the **Tests** folder of the `HOW.Selenium.WebApp.Tests.MSTest`.

Create a new test called `RequestPage_Link_Visible_When_Logged_In()` that will check for the "New Request" link in anonymous mode, then login and check for the "New Request" link as an authenticated user.

- `RequestPage_Link_Visible_When_Logged_In()`

```csharp
[TestMethod]
public void RequestPage_Link_Visible_When_Logged_In()
{
    HomePage.GoTo();

    var linkText = "New Request";

    Assert.IsFalse(HomePage.IsNavLinkPresent(linkText),$"Link with name={linkText} was present when it shouldn't be.");

    LoginPage.GoTo();
    LoginPage.Login("a@a.com", "Pass@word1");

    Assert.IsTrue(HomePage.IsNavLinkPresent(linkText), $"Link with name={linkText} was NOT present when it should be.");
}
```

- `RequestPage_Enter_New_Request_Form()`

```csharp
[TestMethod]
public void RequestPage_Enter_New_Request_Form()
{
    RequestPage.GoTo();

    //should redirect to login page
    LoginPage.Login("a@a.com", "Pass@word1");

    RequestPage.SubmitRequest("First Request", "My body of proof");

    Assert.IsTrue(HomePage.IsAt, "failed to redirect to home page");
}
```

### WaitDrivers

In this section, we're going to cover how WaitDriver's work and get an understanding of why they are important and useful.

```js
let inputs = document.querySelectorAll('[type="text"]'),
    knapp = document.querySelector('#skicka')
knapp.disabled = true

for (i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('input',() => {
    let values = []
    inputs.forEach(v => values.push(v.value))
    knapp.disabled = values.includes('')
  })
}
```

### Calling Javascript



