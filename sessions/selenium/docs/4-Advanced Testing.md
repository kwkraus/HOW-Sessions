# Advanced Testing Concepts

## Interacting with Pages and Elements

Selenium has several different API calls that allow a test to access the source of a page, title for a page, and any elements loaded into the Document Object Model (DOM).  

In this section, we'll create several tests in our `HOW.Selenium.WebApp.Framework` project that demonstrate different API calls to manipulate and verify page data and behavior.

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

Now let's create two new tests in the `HOW.Selenium.WebApp.MSTests` project that will consume each of these new methods to assert we have a valid Title for the page.

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
    public static class PrivacyPage
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

  - Cut/Past this necessary code into the `Request.cshtml.cs` file.  Notice it includes the `[Authorize]` attribute to ensure the page can only be rendered by authenticated users.
  
    ```csharp
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc.RazorPages;

    namespace HOW.Selenium.WebApp.Pages
    {
        [Authorize]
        public class RequestModel : PageModel
        {
            public string Title { get; set; }
            public string Body { get; set; }

            public void OnGet()
            {

            }
        }
    }
    ```

- Add code to allow access to the Request page only for Authenticated users. 

  - First add these lines to the top of _Layout.cshtml

    ```html
    @inject SignInManager<IdentityUser> SignInManager
    @inject UserManager<IdentityUser> UserManager
    ```
  - Next add this code for the link to the new Request page - place it between the 'Index' and 'Privacy' links

    ```html
    @if (SignInManager.IsSignedIn(User))
    {
    <li class="nav-item">
        <a class="nav-link text-dark" asp-area="" asp-page="/Request">New Request</a>
    </li>
    }
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
            try
            {
                Driver.Instance.FindElement(By.Id("Title")).SendKeys(title);
                Driver.Instance.FindElement(By.Id("Body")).SendKeys(body);

                new WebDriverWait(Driver.Instance, new TimeSpan(0, 0, 5))
                    .Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.Id("Create_Request"))).Click();
            }
            catch (WebDriverTimeoutException wdex)
            {
                throw new ApplicationException($"Timeout reached when trying to click Create_Request button", wdex);
            }
        }
    }
    ```

    > NOTE: Discuss the `WebDriverWait` object and how it is the recommended method for observability into the virtual DOM.  TODO:  Add some discussion topics for this.....

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

Add the following using statements
```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.VisualStudio.TestTools.UnitTesting;
```

Add the TestClass attribute to the class, make it public and inherit it from TestBase
```csharp
[TestClass]
public class RequestPageTests : TestBase
```

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

Compile the projects and run the test to verify that it works.  

### WebDriverWait

The WebDriverWait class can be used in many ways. When ever we need to perform any operation on element, we can use webdriver wait to check if the element is Present or visible or enabled or disabled or Clickable etc.

WebDriver can generally be said to have a blocking API. Because it is an out-of-process library that instructs the browser what to do, and because the web platform has an intrinsically asynchronous nature, WebDriver does not track the active, real-time state of the DOM.

[Reference Doc](https://www.selenium.dev/documentation/en/webdriver/waits/)

In this section, we're going to cover how WaitDriver's work and get an understanding of why they are important and useful.

We will add some JavaScript that will disable the "Create" button and only enable it for clicking after text has been entered into all fields and a delay has expired.

Add the following code at the bottom of the `Request.cshtml` page.  this code will be executed when the page loads and it will enable the Create button after 5 seconds.  

```js
@section Scripts {
    <script type="text/javascript">
        let inputs = document.querySelectorAll('[type="text"]'),
            requestbtn = document.querySelector('#Create_Request')
        requestbtn.disabled = true

        for (i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('input', () => {
                let values = []
                inputs.forEach(v => values.push(v.value))
                setTimeout(function(isDisabled){
                    console.log('Timeout reached');
                    requestbtn.disabled = isDisabled;
                }, 5000, values.includes(''))
            })
        }
    </script>
}
```

- You will need to stop the running webapp, rebuild the solution and run the webapp again for the changes to take effect

From the previous section, you'll recall we added the `SubmitRequest()` method to the `RequestPage` Page Object and this method contains a Selenium API that uses the WebDriverWait object.

```csharp
new WebDriverWait(Driver.Instance, new TimeSpan(0, 0, 5))
    .Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.Id("Create_Request"))).Click();
```

This class takes a TimeSpan that defines the length of time to wait for a specific condition to become true.  In this case, the condition is that an element is Clickable.


This call is also wrapped in a try/catch and when a timeout is reached, the WebDriverWait object will throw an `WebDriverTimeoutException`.  we can then react to this timeout.

Let's run the `RequestPage_Enter_New_Request_Form()` test and see if it succeeds.

Now reduce the `TimeSpan` from 5 seconds to 2 seconds.  you should see the test fail and log the exception information for troubleshooting.


> NOTE:  This would be a great time to show the other `ExpectedConditions` and discuss their benefit. [Reference Doc](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/support/ui/ExpectedConditions.html)


Discussion Points:

- Lots of different `ExpectedConditions` makes for flexibility/resiliency

- TimeSpan will wait UNTIL condition is met, so if condition is met in milliseconds, you don't have to wait for entire configured timeout.


### Calling JavaScript

There are times when executing JavaScript to initiate a behavior is appropriate.  Here we will execute JavaScript that lives in our Page Object and then demonstrate how to work with Alerts, which are not part of the DOM.

Add the following method to the HomePage Page Object.  This is just a simple alert with our own text that gets closed.

```csharp
public static void ClickAlertFromExecuteJS()
{
    ((IJavaScriptExecutor)Driver.Instance).ExecuteScript(
        "alert('executed from selenium ExecuteScript');");

    IAlert alert = Driver.Instance.SwitchTo().Alert();
    Thread.Sleep(1500);
    alert.Accept();
}
```

Let's create a test to demonstrate.

Add the following test to the HomePageTests class

```csharp
[TestMethod]
public void HomePage_Execute_Alert_And_Dismiss()
{
    HomePage.GoTo();
    HomePage.ClickAlertFromExecuteJS();
    Assert.IsTrue(HomePage.IsAt);
}
```

There is a Thread.Sleep(1500) in this test just for students to see the alert and how it gets accepted.

Run test to demonstrate.

### Detecting JavaScript

Now there may also be a time when you want to detect if some JavaScript has been executed on a page.  For example you may have an alert box display an error message when an user inputs invalid data.  

For this example we will add a box on the privacy page to enter a date and a button to then accept the privacy policy.   When the button is clicked we will display an invalid date alert message.

First lets add the box and the button to Privacy.cshtml

```js
    <div class="form-group">
        <label asp-for="Date" class="control-label"></label>
        <input asp-for="Date" class="form-control" />
    </div>
    <div class="form-group">
        <input id="Create_Alert" type="submit" value="Submit" onclick="alert('Alert! Alert!');" class="btn btn-primary" />
    </div>
```

Then we need to add this to the PrivacyModel class in the Privacy.cshtml.cs file

```csharp
        public string Date { get; set; }
```

Now that we have the page ready we can start building out the framework code needed for our test.   Go to the framework project and open the PrivacyPage.cs file in the pages folder. Add the following two methods 

```csharp
    public static void ClickSubmitButton()
    {
        var buttonID = "Create_Alert";

        try
        {
            Driver.Instance.FindElement(By.Id("Date")).SendKeys("12/33/2020");
            IWebElement submitbutton = Driver.Instance.FindElement(By.Id(buttonID));
            submitbutton.Click();
        }
        catch (NoSuchElementException)
        {
            throw new ApplicationException($"Failed to find link with id={buttonID}");
        }
    }

    public static bool IsAlertDisplayed()
    {
        try
        {
            IAlert alert = Driver.Instance.SwitchTo().Alert();
            alert.Accept();
            return true;
        }
        catch (NoAlertPresentException ex)
        {
            Helper.TakeScreenShot(Driver.Instance, nameof(IsAlertDisplayed));
            throw new NoAlertPresentException($"No Alert Displayed", ex);
        }

    }
```


Now that we have our page updated on the website and the Framework updated to include the functionality needed we can go ahead and create a test to check for the alert.

Go ahead and add a new class called PrivacyPageTests.cs to the Tests folder in our MSTest project.  Then add the following code to it.

```csharp

using HOW.Selenium.WebApp.Framework.Pages;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace HOW.Selenium.WebApp.Tests.MSTest.Tests
{
    [TestClass]
    public class PrivacyPageTests :TestBase
    {

        [TestMethod]
        public void PrivacyPage_Click_AlertButton()
        {
            PrivacyPage.GoTo();

            PrivacyPage.ClickSubmitButton();

            Assert.IsTrue(PrivacyPage.IsAlertDisplayed(), "Failed to display alert");
        }
    }
}

```

Now stop the running webapp, rebuild the solution, restart the webapp and then run the `PrivacyPage_Click_AlertButton()` test to verify that it works correctly.

To simulate the test failing you can add Thread.Sleep after the call to the ClickSubmitButton in the test.  Then during that pause click on the alert so then the check to see if the alert is displayed should fail





### Take a Screenshot

There are times when a failed test is difficult to troubleshoot based on log data and having the ability to view the state of the page at the moment of failure would help.

Previous we created a class called `Helper.cs` that contains a helper method for taking sceenshots.  Go back and review that class.

In order to use this helper method, we'll add a call to it from within the catch block of the `SubmitRequest()` method in the RequestPage Page Object.

If we lower the WebDriverWait Timespan to 2 seconds, it should throw an exception and a sceenshot can be taken.

add the following Helper line of code to the `SubmitRequest` method catch block

```csharp
catch (WebDriverTimeoutException wdex)
{
    Helper.TakeScreenShot(Driver.Instance, nameof(SubmitRequest));
    throw new ApplicationException($"Timeout reached when trying to click Create_Request button", wdex);
}
```

Now run the `RequestPage_Enter_New_Request_Form()` test again and it should fail.  Check the bin\debug\netcoreapp3.1 folder for a new .png file that starts with "SubmitRequest-*"  this is the sceenshot the application took