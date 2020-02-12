# Entity Framework Core

![FirstMigration](/images/orm.jpg)



Entity Framework (EF) Core is a lightweight, extensible, open source and cross-platform version of the popular Entity Framework data access technology.

EF Core can serve as an object-relational mapper (O/RM), enabling .NET developers to work with a database using .NET objects, and eliminating the need for most of the data-access code they usually need to write.

EF Core supports many database engines, see [Database Providers](https://docs.microsoft.com/en-us/ef/core/providers/index?tabs=dotnet-core-cli) for details.

## The Model

With EF Core, data access is performed using a model. A model is made up of entity classes and a context object that represents a session with the database, allowing you to query and save data. See [Creating a Model](https://docs.microsoft.com/en-us/ef/core/modeling/index) to learn more.

You can generate a model from an existing database, hand code a model to match your database, or use EF Migrations to create a database from your model, and then evolve it as your model changes over time.

```C#
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Intro
{
   

    public class Blog
    {
        public int BlogId { get; set; }
        public string Url { get; set; }
        public int Rating { get; set; }
        public List<Post> Posts { get; set; }
    }

    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public int BlogId { get; set; }
        public Blog Blog { get; set; }
    }
}
```

## Context 

## Entity Types


Including a DbSet of a type on your context means that it is included in EF Core's model; we usually refer to such a type as an entity. EF Core can read and write entity instances from/to the database, and if you're using a relational database, EF Core can create tables for your entities via migrations.

Including types in the model
By convention, types that are exposed in DbSet properties on your context are included in the model as entities. Entity types that are specified in the OnModelCreating method are also included, as are any types that are found by recursively exploring the navigation properties of other discovered entity types.

In the code sample below, all types are included:

Blog is included because it's exposed in a DbSet property on the context.
Post is included because it's discovered via the Blog.Posts navigation property.
AuditEntry because it is specified in OnModelCreating.

```C#
      
       public class BloggingContext : DbContext
    {
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Post> Posts { get; set; }
      
      ...
      public class Blog
    {
        public int BlogId { get; set; }
        public string Name {get; set;}
        public string Url { get; set; }
        public int Rating { get; set; }
        public List<Post> Posts { get; set; }
    }

    public class Post
    {
       ....
```




```C#
     public class BloggingContext : DbContext
    {
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(
                @"Server=(localdb)\mssqllocaldb;Database=Blogging;Integrated Security=True");
        }
    }
```

## Querying

Instances of your entity classes are retrieved from the database using Language Integrated Query (LINQ). See Querying Data to learn more.

```C#
using (var db = new BloggingContext())
{
    var blogs = db.Blogs
        .Where(b => b.Rating > 3)
        .OrderBy(b => b.Url)
        .ToList();
}
```

## Saving Data

Data is created, deleted, and modified in the database using instances of your entity classes. See Saving Data to learn more.

```C#
    using (var db = new BloggingContext())
{
    var blog = new Blog { Url = "http://sample.com" };
    db.Blogs.Add(blog);
    db.SaveChanges();
}

```

## Migrations

A data model changes during development and gets out of sync with the database. You can drop the database and let EF create a new one that matches the model, but this procedure results in the loss of data. The migrations feature in EF Core provides a way to incrementally update the database schema to keep it in sync with the application's data model while preserving existing data in the database.

Migrations includes command-line tools and APIs that help with the following tasks:

- [Create a migration](##Create-a-migration). Generate code that can update the database to sync it with a set of model changes.
- [Update the database](##Update-the-database). Apply pending migrations to update the database schema.
- [Customize migration code](##Customize-migration-code). Sometimes the generated code needs to be modified or supplemented.
- [Remove a migration](##Remove-a-migration). Delete the generated code.
- [Revert a migration](##Revert-a-migration). Undo the database changes.
- [Generate SQL scripts](##Generate-SQL-scripts). You might need a script to update a production database or to troubleshoot migration code.
- [Apply migrations at runtime](##Apply-migrations-at-runtime). When design-time updates and running scripts aren't the best options, call the Migrate() method.

>Tip
If the DbContext is in a different assembly than the startup project, you can explicitly specify the target and startup projects in either the Package Manager Console tools or the .NET Core CLI tools.

## Install the tools

Install the command-line tools:

For Visual Studio, we recommend the Package Manager Console tools.
For other development environments, choose the .NET Core CLI tools.

## Create a migration


![FirstMigration](/images/firstmigration.jpg)

After you've defined your initial model, it's time to create the database. To add an initial migration, run the following command.

```powershell 
    Add-Migration InitialCreate
```

Three files are added to your project under the Migrations directory:

XXXXXXXXXXXXXX_InitialCreate.cs--The main migrations file. Contains the operations necessary to apply the migration (in Up()) and to revert it (in Down()).
XXXXXXXXXXXXXX_InitialCreate.Designer.cs--The migrations metadata file. Contains information used by EF.
MyContextModelSnapshot.cs--A snapshot of your current model. Used to determine what changed when adding the next migration.
The timestamp in the filename helps keep them ordered chronologically so you can see the progression of changes.

[Read this article by Christos Matskas](https://cmatskas.com/ef-core-migrations-with-existing-database-schema-and-data/) before Migrating with an existing database scheme and data.

>Tip:   
Key take away is before you run the updated-database command on your intailzing first migration you need to do the following:

>Now go to the file created under `DbProject\Migrations\<MigrationName>.cs` and remove all the code inside the [Up()](##Delete-Code-from-Up-Method) method. This will ensure that the migration will run against your database without altering your existing schema (assuming there are no changes). You can leave the Down() method as is. 

## Delete Code from Up Method on Database First Initial Migration

- Before Migrating with an existing database scheme and data delete all code from the Up method as shown below on InitialCreate first model migration to create a empty migration:

![](/images/deleteCodeUp.jpg)

Next, you want to run this migration against your database so type and run the following command: 

```powershell
    dotnet ef database update
```



> Tip
You are free to move Migrations files and change their namespace. New migrations are created as siblings of the last migration.

## Update the database

Next, apply the migration to the database to create the schema.

```powershell
    Update-Database
```

## Customize migration code

After making changes to your EF Core model, the database schema might be out of sync. To bring it up to date, add another migration. The migration name can be used like a commit message in a version control system. For example, you might choose a name like AddProductReviews if the change is a new entity class for reviews.

```powershell
    Add-Migration AddProductReviews
```

Once the migration is scaffolded (code generated for it), review the code for accuracy and add, remove or modify any operations required to apply it correctly.

For example, a migration might contain the following operations:

```C#
    migrationBuilder.DropColumn(
    name: "FirstName",
    table: "Customer");

migrationBuilder.DropColumn(
    name: "LastName",
    table: "Customer");

migrationBuilder.AddColumn<string>(
    name: "Name",
    table: "Customer",
    nullable: true);

```

While these operations make the database schema compatible, they don't preserve the existing customer names. To make it better, rewrite it as follows.

```C#
migrationBuilder.AddColumn<string>(
    name: "Name",
    table: "Customer",
    nullable: true);

migrationBuilder.Sql(
@"
    UPDATE Customer
    SET Name = FirstName + ' ' + LastName;
");

migrationBuilder.DropColumn(
    name: "FirstName",
    table: "Customer");

migrationBuilder.DropColumn(
    name: "LastName",
    table: "Customer");
```

 >Tip
The migration scaffolding process warns when an operation might result in data loss (like dropping a column). If you see that warning, be especially sure to review the migrations code for accuracy.

Apply the migration to the database using the appropriate command.

```powershell
    Update-Database
```

## Empty migrations

Sometimes it's useful to add a migration without making any model changes. In this case, adding a new migration creates code files with empty classes. You can customize this migration to perform operations that don't directly relate to the EF Core model. Some things you might want to manage this way are:

- Full-Text Search
- Functions
- Stored procedures
- Triggers
- Views

## Remove a migration

Sometimes you add a migration and realize you need to make additional changes to your EF Core model before applying it. To remove the last migration, use this command.

```powershell
    Remove-Migration
```

After removing the migration, you can make the additional model changes and add it again.

## Revert a migration

If you already applied a migration (or several migrations) to the database but need to revert it, you can use the same command to apply migrations, but specify the name of the migration you want to roll back to.

```powershell
    Update-Database LastGoodMigration
```

## Generate SQL scripts

When debugging your migrations or deploying them to a production database, it's useful to generate a SQL script. The script can then be further reviewed for accuracy and tuned to fit the needs of a production database. The script can also be used in conjunction with a deployment technology. The basic command is as follows.

## Apply migrations at runtime

Some apps may want to apply migrations at runtime during startup or first run. Do this using the `Migrate()` method.

This method builds on top of the IMigrator service, which can be used for more advanced scenarios. Use `myDbContext.GetInfrastructure().GetService.IMigrator()` to access it.

```C#
    myDbContext.Database.Migrate();
```

>Warning:
>- This approach isn't for everyone. While it's great for apps with a local database, most applications will require more robust deployment strategy like generating SQL scripts.
>- Don't call EnsureCreated() before Migrate(). EnsureCreated() bypasses Migrations to create the schema, which causes Migrate() to fail.

