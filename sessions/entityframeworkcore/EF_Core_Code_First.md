# Getting Started with EF Core


In this tutorial, you create a .NET Core console app using a code first appoarch that performs data access against a SQL Server database using Entity Framework Core.

You can follow the tutorial by using Visual Studio on Windows.

[View this article's sample on GitHub.](https://github.com/aspnet/EntityFramework.Docs/tree/master/samples/core/GetStarted)

## Install the following software

Visual Studio 2019 version 16.3 or later with this workload:
.NET Core cross-platform development (under Other Toolsets)

## Create a new project

Open Visual Studio
Click Create a new project
Select Console App (.NET Core) with the C# tag and click Next
Enter EFCoreCodeFirst for the name and click Create

## Create the model

Define a context class and entity classes that make up the model.

1. Add using statements to the top of the Program.cs

```C#
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
```

2. Add the below code to Program.cs just below the class Program.  As shown below:


```C#

    class Program
       {
           static void Main(string[] args)
           {
               //this will be replaced
               Console.WriteLine("Hello World!");
           }
       }

    //Add Code below to Program file  
    public class BloggingContext : DbContext
    {
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlServer("Data Source=.;Initial Catalog=Blogging;Integrated Security=True");
    }

    public class Blog
    {
        public int BlogId { get; set; }
        public string Url { get; set; }

        public List<Post> Posts { get; } = new List<Post>();
    }

    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public int BlogId { get; set; }
        public Blog Blog { get; set; }
    }


```

> Tip: In a real app, you put each class in a separate file and put the connection string in a configuration file or environment variable. To keep the tutorial simple, everything is contained in one file.

## Create the database

The following steps use migrations to create a database.

Double click on project to open `<projectname>.csproj`
observer the project file to see what pacakages are currently installed.

Run the following commands in Package Manager Console

```powershell
Install-Package Microsoft.EntityFrameworkCore.Tools
Install-Package Microsoft.EntityFrameworkCore.SqlServer
```

>Notice the packages in the .csproj file being added

Now we will add our first migration by running the `Add-Migration` command.

```powershell
Add-Migration InitialCreate
```
Now lets create the tables in the database by running `Update-Database`

```powershell
Update-Database
```

## Create, read, update & delete

Open Program.cs and replace the contents with the following code:

```C#

    class Program
    {
        static void Main()
        {

            //replace heloo world with below code
            using (var db = new BloggingContext())
            {
                // Create
                Console.WriteLine("Inserting a new blog");
                db.Add(new Blog { Url = "http://blogs.msdn.com/adonet" });
                db.SaveChanges();

                // Read
                Console.WriteLine("Querying for a blog");
                var blog = db.Blogs
                    .OrderBy(b => b.BlogId)
                    .First();

                // Update
                Console.WriteLine("Updating the blog and adding a post");
                blog.Url = "https://devblogs.microsoft.com/dotnet";
                blog.Posts.Add(
                    new Post
                    {
                        Title = "Hello World",
                        Content = "I wrote an app using EF Core!"
                    });
                db.SaveChanges();

                // Delete
                Console.WriteLine("Delete the blog");
                db.Remove(blog);
                db.SaveChanges();
            }
        }
    }

```

## Run the app

Visual Studio uses an inconsistent working directory when running .NET Core console apps. (see dotnet/project-system#3619) This results in an exception being thrown: no such table: Blogs. To update the working directory:

Right-click on the project and select Edit Project File

Just below the TargetFramework property, add the following:

```xml
<StartWorkingDirectory>$(MSBuildProjectDirectory)</StartWorkingDirectory>
```