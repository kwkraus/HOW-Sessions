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

In order to persist new requests to the database, we will leverage the use of ASP.NET Identity and its `ApplicationDbContext` for persistence to LocalDb.

Create a new entity called `Request.cs` in a new folder called **Entities** that will represent a request in our system.  Add the following code to this class

- `Request.cs`

  ```csharp
    using System;
    using System.ComponentModel.DataAnnotations;

    namespace HOW.Selenium.WebApp.Entities
    {
        public class Request
        {
            public int Id { get; set; }

            [Required(ErrorMessage = "Each Request needs a Title")]
            [MaxLength(50)]
            public string Title { get; set; }

            [MaxLength(500)]
            public string Body { get; set; }

            [Required(ErrorMessage = "Each Request needs a Priority")]
            public Priority Priority { get; set; }

            public DateTime CreatedDate { get; set; }
        }

        public enum Priority
        {
            Low,
            Medium,
            High
        }
    }
  ```

Add the new `Request.cs` entity to the `ApplicaitonDbContext` by adding a new property to the class

- `ApplicationDbContext`

  ```csharp
    using HOW.Selenium.WebApp.Entities;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;

    namespace HOW.Selenium.WebApp.Data
    {
        public class ApplicationDbContext : IdentityDbContext
        {
            public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
                : base(options)
            {
            }

            public DbSet<Request> Requests { get; set; }
        }
    }
  ```

Create a new Razor page within **Pages/Requests** folder to the `HOW.Selenium.WebApp` project.

- Create new folder called **Requests** within the **Pages** folder

- Use Visual Studio's __Razor Pages using Entity Framework (CRUD)__ scaffolded template using our newly created `Request` entity.  This will create several pages within the Requests folder: Index.cshtml, Delete.cshtml, Details.cshtml, Edit.cshtml, Create.cshtml

  - Make sure to scaffold these pages using the `ApplicationDbContext`

- Add the `[Authorize]` attribute to all scaffolded pages to ensure they can only be rendered by authenticated users.

> NOTE: This is not an ASP.NET Core Razor Page, so copy and paste will be fine.


- `Request.cshtml`

  ```xml

  ```

- `Request.cshtml.cs`

  ```csharp

  ```

- `Layout.cshtml`

  ```xml

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



