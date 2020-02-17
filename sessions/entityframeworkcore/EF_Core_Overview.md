# Entity Framework Core

Entity Framework (EF) Core is a lightweight, extensible, open source and cross-platform version of the popular Entity Framework data access technology.

EF Core can serve as an object-relational mapper (O/RM), enabling .NET developers to work with a database using .NET objects, and eliminating the need for most of the data-access code they usually need to write.

EF Core supports many database engines, see [Database Providers](https://docs.microsoft.com/en-us/ef/core/providers/index?tabs=dotnet-core-cli) for details.

![ORM](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/images/orm.jpg)


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

# Entity Properties

Each entity type in your model has a set of properties, which EF Core will read and write from the database. If you're using a relational database, entity properties map to table columns.

## Included and excluded properties

By convention, all public properties with a getter and a setter will be included in the model.

Specific properties can be excluded as follows:

### Data Annotations:

```C#
public class Blog
{
    public int BlogId { get; set; }
    public string Url { get; set; }

    [NotMapped]
    public DateTime LoadedFromDatabase { get; set; }
}

```

### Fluent API:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Blog>()
        .Ignore(b => b.LoadedFromDatabase);
}

```

## Column names

By convention, when using a relational database, entity properties are mapped to table columns having the same name as the property.

If you prefer to configure your columns with different names, you can do so as following:


### Data Annotations:

```C#
public class Blog
{
    [Column("blog_id")]
    public int BlogId { get; set; }
    public string Url { get; set; }
}

```


### Fluent API:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Blog>()
        .Property(b => b.BlogId)
        .HasColumnName("blog_id");
}

```


## Column data types

When using a relational database, the database provider selects a data type based on the .NET type of the property. It also takes into account other metadata, such as the configured [maximum length](https://docs.microsoft.com/en-us/ef/core/modeling/entity-properties?tabs=fluent-api%2Cwithout-nrt#maximum-length), whether the property is part of a primary key, etc.

For example, SQL Server maps DateTime properties to datetime2(7) columns, and string properties to nvarchar(max) columns (or to nvarchar(450) for properties that are used as a key).

You can also configure your columns to specify an exact data type for a column. For example the following code configures Url as a non-unicode string with maximum length of 200 and Rating as decimal with precision of 5 and scale of 2:

### Data Annotations:

```C#
public class Blog
{
    public int BlogId { get; set; }
    [Column(TypeName = "varchar(200)")]
    public string Url { get; set; }
    [Column(TypeName = "decimal(5, 2)")]
    public decimal Rating { get; set; }
}

```


### Fluent API:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Blog>(eb =>
    {
        eb.Property(b => b.Url).HasColumnType("varchar(200)");
        eb.Property(b => b.Rating).HasColumnType("decimal(5, 2)");
    });
}

```

## Maximum length

Configuring a maximum length provides a hint to the database provider about the appropriate column data type to choose for a given property. Maximum length only applies to array data types, such as string and byte[].

 >**Note**   
>Entity Framework does not do any validation of maximum length before passing data to the provider. It is up to the provider or data store to validate if appropriate. For example, when targeting SQL Server, exceeding the maximum length will result in an exception as the data type of the underlying column will not allow excess data to be stored.

In the following example, configuring a maximum length of 500 will cause a column of type nvarchar(500) to be created on SQL Server:

### Data Annotations:

```C#
public class Blog
{
    public int BlogId { get; set; }
    [MaxLength(500)]
    public string Url { get; set; }
}

```

### Fluent API:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Blog>()
        .Property(b => b.Url)
        .HasMaxLength(500);
}
```

## Required and optional properties

A property is considered optional if it is valid for it to contain `null`. If `null` is not a valid value to be assigned to a property then it is considered to be a required property. When mapping to a relational database schema, required properties are created as non-nullable columns, and optional properties are created as nullable columns.

Conventions
By convention, a property whose .NET type can contain null will be configured as optional, whereas properties whose .NET type cannot contain null will be configured as required. For example, all properties with .NET value types (`int`, `decimal`, `bool`, etc.) are configured as required, and all properties with nullable .NET value types (`int?`, `decimal?`, `bool?`, etc.) are configured as optional.

C# 8 introduced a new feature called [nullable reference types](https://docs.microsoft.com/en-us/dotnet/csharp/tutorials/nullable-reference-types), which allows reference types to be annotated, indicating whether it is valid for them to contain null or not. This feature is disabled by default, and if enabled, it modifies EF Core's behavior in the following way:

If nullable reference types are disabled (the default), all properties with .NET reference types are configured as optional by convention (e.g. `string`).
If nullable reference types are enabled, properties will be configured based on the C# nullability of their .NET type: `string?` will be configured as optional, whereas string will be configured as required.
The following example shows an entity type with required and optional properties, with the nullable reference feature disabled (the default) and enabled:

### Without nullable reference types (default)

```C#
public class CustomerWithoutNullableReferenceTypes
{
    public int Id { get; set; }
    [Required]                               // Data annotations needed to configure as required
    public string FirstName { get; set; }    
    [Required]
    public string LastName { get; set; }     // Data annotations needed to configure as required
    public string MiddleName { get; set; }   // Optional by convention
}

```

### With nullable reference types

```C#
public class Customer
{
    public int Id { get; set; }
    public string FirstName { get; set; }    // Required by convention
    public string LastName { get; set; }     // Required by convention
    public string? MiddleName { get; set; }  // Optional by convention

    public Customer(string firstName, string lastName, string? middleName = null)
    {
        FirstName = firstName;
        LastName = lastName;
        MiddleName = middleName;
    }
}
```

Using nullable reference types is recommended since it flows the nullability expressed in C# code to EF Core's model and to the database, and obviates the use of the Fluent API or Data Annotations to express the same concept twice.

 >**Note**   
>Exercise caution when enabling nullable reference types on an existing project: reference type properties which were previously configured as optional will now be configured as required, unless they are explicitly annotated to be nullable. When managing a relational database schema, this may cause migrations to be generated which alter the database column's nullability.

For more information on nullable reference types and how to use them with EF Core, see the [dedicated documentation page for this feature](https://docs.microsoft.com/en-us/ef/core/miscellaneous/nullable-reference-types).

## Explicit configuration
A property that would be optional by convention can be configured to be required as follows:

### Data Annotations:

```C#
public class Blog
{
    public int BlogId { get; set; }
    [Required]
    public string Url { get; set; }
}

```

### Fluent API:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Blog>()
        .Property(b => b.Url)
        .IsRequired();
}
```

Keys

A key serves as a unique identifier for each entity instance. Most entities in EF have a single key, which maps to the concept of a primary key in relational databases (for entities without keys, see Keyless entities). Entities can have additional keys beyond the primary key (see Alternate Keys for more information).

By convention, a property named Id or <type name>Id will be configured as the primary key of an entity.

### C#:

```C#
class Car
{
    public string Id { get; set; }

    public string Make { get; set; }
    public string Model { get; set; }
}

class Truck
{
    public string TruckId { get; set; }

    public string Make { get; set; }
    public string Model { get; set; }
}

```

>**Note**           
>Owned entity types use different rules to define keys.

You can configure a single property to be the primary key of an entity as follows:

### Data Annotations:

```C#
class Car
{
    [Key]
    public string LicensePlate { get; set; }

    public string Make { get; set; }
    public string Model { get; set; }
}

```

### Fluent API:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Car>()
        .HasKey(c => c.LicensePlate);
}
```

You can also configure multiple properties to be the key of an entity - this is known as a composite key. Composite keys can only be configured using the Fluent API; conventions will never setup a composite key, and you can not use Data Annotations to configure one.


### C#:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Car>()
        .HasKey(c => new { c.State, c.LicensePlate });
}
```

## Key types and values

While EF Core supports using properties of any primitive type as the primary key, including `string`, `Guid`, `byte[]` and others, not all databases support all types as keys. In some cases the key values can be converted to a supported type automatically, otherwise the conversion should be specified manually.

Key properties must always have a non-default value when adding a new entity to the context, but some types will be generated by the database. In that case EF will try to generate a temporary value when the entity is added for tracking purposes. After SaveChanges is called the temporary value will be replaced by the value generated by the database.

> **Important**   
>If a key property has its value generated by the database and a non-default value is specified when an entity is added, then EF will assume that the entity already exists in the database and will try to update it instead of inserting a new one. To avoid this turn off value generation or see how to specify explicit values for generated properties.

## Alternate Keys

An alternate key serves as an alternate unique identifier for each entity instance in addition to the primary key; it can be used as the target of a relationship. When using a relational database this maps to the concept of a unique index/constraint on the alternate key column(s) and one or more foreign key constraints that reference the column(s).

 >**Tip**   
>If you just want to enforce uniqueness on a column, define a unique index rather than an alternate key ([see Indexes](https://docs.microsoft.com/en-us/ef/core/modeling/indexes)). In EF, alternate keys are read-only and provide additional semantics over unique indexes because they can be used as the target of a foreign key.

Alternate keys are typically introduced for you when needed and you do not need to manually configure them. By convention, an alternate key is introduced for you when you identify a property which isn't the primary key as the target of a relationship.

### C#:

```C#
class MyContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Post> Posts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Blog)
            .WithMany(b => b.Posts)
            .HasForeignKey(p => p.BlogUrl)
            .HasPrincipalKey(b => b.Url);
    }
}

public class Blog
{
    public int BlogId { get; set; }
    public string Url { get; set; }

    public List<Post> Posts { get; set; }
}

public class Post
{
    public int PostId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }

    public string BlogUrl { get; set; }
    public Blog Blog { get; set; }
}
```
You can also configure a single property to be an alternate key:

### C#:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Car>()
        .HasAlternateKey(c => c.LicensePlate);
}
```
You can also configure multiple properties to be an alternate key (known as a composite alternate key):

### C#:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Car>()
        .HasAlternateKey(c => new { c.State, c.LicensePlate });
}
```

Finally, by convention, the index and constraint that are introduced for an alternate key will be named AK_<type name>_<property name> (for composite alternate keys <property name> becomes an underscore separated list of property names). You can configure the name of the alternate key's index and unique constraint:

### C#:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Car>()
        .HasAlternateKey(c => c.LicensePlate)
        .HasName("AlternateKey_LicensePlate");
}
```

# Querying

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

Data is created, deleted, and modified in the database using instances of your entity classes. 


### Basic Save

#### Adding Data

Use the DbSet.Add method to add new instances of your entity classes. The data will be inserted in the database when you call SaveChanges.


```C#
    using (var db = new BloggingContext())
{
    var blog = new Blog { Url = "http://sample.com" };
    db.Blogs.Add(blog);
    db.SaveChanges();
}

```

>Tip        
>The Add, Attach, and Update methods all work on the full graph of entities passed to them, as described in the Related Data section. Alternately, the EntityEntry.State property can be used to set the state of just a single entity. For example, context.Entry(blog).State = EntityState.Modified.

#### Updating Data

EF will automatically detect changes made to an existing entity that is tracked by the context. This includes entities that you load/query from the database, and entities that were previously added and saved to the database.

Simply modify the values assigned to properties and then call SaveChanges.


```C#
   using (var context = new BloggingContext())
{
    var blog = context.Blogs.First();
    blog.Url = "http://sample.com/blog";
    context.SaveChanges();
}

```

#### Deleting Data

Use the DbSet.Remove method to delete instances of your entity classes.

If the entity already exists in the database, it will be deleted during SaveChanges. If the entity has not yet been saved to the database (that is, it is tracked as added) then it will be removed from the context and will no longer be inserted when SaveChanges is called.

```C#
 using (var context = new BloggingContext())
{
    var blog = context.Blogs.First();
    context.Blogs.Remove(blog);
    context.SaveChanges();
}

```


#### Multiple Operations in a single SaveChanges

You can combine multiple Add/Update/Remove operations into a single call to SaveChanges.

>Note           
>For most database providers, SaveChanges is transactional. This means all the operations will either succeed or fail and the operations will never be left partially applied.

```C#
using (var context = new BloggingContext())
{
    // seeding database
    context.Blogs.Add(new Blog { Url = "http://sample.com/blog" });
    context.Blogs.Add(new Blog { Url = "http://sample.com/another_blog" });
    context.SaveChanges();
}

using (var context = new BloggingContext())
{
    // add
    context.Blogs.Add(new Blog { Url = "http://sample.com/blog_one" });
    context.Blogs.Add(new Blog { Url = "http://sample.com/blog_two" });

    // update
    var firstBlog = context.Blogs.First();
    firstBlog.Url = "";

    // remove
    var lastBlog = context.Blogs.Last();
    context.Blogs.Remove(lastBlog);

    context.SaveChanges();
}

```

#### Adding a related entity

If you reference a new entity from the navigation property of an entity that is already tracked by the context, the entity will be discovered and inserted into the database.

In the following example, the post entity is inserted because it is added to the Posts property of the blog entity which was fetched from the database.


```C#
using (var context = new BloggingContext())
{
    var blog = context.Blogs.Include(b => b.Posts).First();
    var post = new Post { Title = "Intro to EF Core" };

    blog.Posts.Add(post);
    context.SaveChanges();
}

```

# Raw SQL Queries


Entity Framework Core allows you to drop down to raw SQL queries when working with a relational database. Raw SQL queries are useful if the query you want can't be expressed using LINQ. Raw SQL queries are also used if using a LINQ query is resulting in an inefficient SQL query. Raw SQL queries can return regular entity types or keyless entity types that are part of your model.

## Basic raw SQL queries

You can use the FromSqlRaw extension method to begin a LINQ query based on a raw SQL query. FromSqlRaw can only be used on query roots, that is directly on the DbSet<>.


```C#
var blogs = context.Blogs
    .FromSqlRaw("SELECT * FROM dbo.Blogs")
    .ToList();
```

Raw SQL queries can be used to execute a stored procedure.

```C#
var blogs = context.Blogs
    .FromSqlRaw("EXECUTE dbo.GetMostPopularBlogs")
    .ToList();
```

## Passing parameters

>Warning            
>Always use parameterization for raw SQL queries
>When introducing any user-provided values into a raw SQL query, care must be taken to avoid SQL injection attacks. In addition to validating that such values don't contain invalid characters, always use parameterization which sends the values separate from the SQL text.                     
>In particular, never pass a concatenated or interpolated string ($"") with non-validated user-provided values into FromSqlRaw or ExecuteSqlRaw. The FromSqlInterpolated and ExecuteSqlInterpolated methods allow using string interpolation syntax in a way that protects against SQL injection attacks.

The following example passes a single parameter to a stored procedure by including a parameter placeholder in the SQL query string and providing an additional argument. While this syntax may look like String.Format syntax, the supplied value is wrapped in a DbParameter and the generated parameter name inserted where the {0} placeholder was specified.

```C#
var user = "johndoe";

var blogs = context.Blogs
    .FromSqlInterpolated($"EXECUTE dbo.GetMostPopularBlogsForUser {user}")
    .ToList();
```

You can also construct a DbParameter and supply it as a parameter value. Since a regular SQL parameter placeholder is used, rather than a string placeholder, FromSqlRaw can be safely used:

```C#
var user = new SqlParameter("user", "johndoe");

var blogs = context.Blogs
    .FromSqlRaw("EXECUTE dbo.GetMostPopularBlogsForUser @user", user)
    .ToList();
```


# Migrations

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

After you've defined your initial model, it's time to create the database. To add an initial migration, run the following command.

```powershell 
    Add-Migration InitialCreate
```

![FirstMigration](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/images/firstmigration.jpg)

Three files are added to your project under the Migrations directory:

- XXXXXXXXXXXXXX_InitialCreate.cs The main migrations file. Contains the operations necessary to apply the migration (in Up()) and to revert it (in Down()).

- XXXXXXXXXXXXXX_InitialCreate.Designer.cs The migrations metadata file. Contains information used by EF.
MyContextModelSnapshot.cs A snapshot of your current model. Used to determine what changed when adding the next migration.

The timestamp in the filename helps keep them ordered chronologically so you can see the progression of changes.

## Database First Migration
When using a database first appoarch there are important considerations for migrations.

[Read this article by Christos Matskas](https://cmatskas.com/ef-core-migrations-with-existing-database-schema-and-data/) before Migrating with an existing database scheme and data.

>Tip:   
Key take away is before you run the updated-database command on your intailzing first migration you need to do the following:

>Now go to the file created under `DbProject\Migrations\<MigrationName>.cs` and remove all the code inside the [Up()](##Delete-Code-from-Up-Method) method. This will ensure that the migration will run against your database without altering your existing schema (assuming there are no changes). You can leave the Down() method as is. 

## Delete Code from Up Method on Database First Initial Migration

- Before Migrating with an existing database scheme and data delete all code from the Up method as shown below on InitialCreate first model migration to create a empty migration:

![](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/images/deleteCodeUp.jpg)

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

```powershell
   Script-Migration
```


## Apply migrations at runtime

Some apps may want to apply migrations at runtime during startup or first run. Do this using the `Migrate()` method.

This method builds on top of the IMigrator service, which can be used for more advanced scenarios. Use `myDbContext.GetInfrastructure().GetService.IMigrator()` to access it.

```C#
    myDbContext.Database.Migrate();
```

>Warning:
>- This approach isn't for everyone. While it's great for apps with a local database, most applications will require more robust deployment strategy like generating SQL scripts.
>- Don't call EnsureCreated() before Migrate(). EnsureCreated() bypasses Migrations to create the schema, which causes Migrate() to fail.

