# Reverse Engineering

Reverse engineering is the process of scaffolding entity type classes and a DbContext class based on a database schema. It can be performed using the Scaffold-DbContext command of the EF Core Package Manager Console (PMC) tools or the dotnet ef dbcontext scaffold command of the .NET Command-line Interface (CLI) tools.

Installing
Before reverse engineering, you'll need to install either the [PMC tools](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/powershell) (Visual Studio only) or the [CLI tools](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet). See links for details.

You'll also need to install an appropriate [database provider](https://docs.microsoft.com/en-us/ef/core/providers/index?tabs=dotnet-core-cli) for the database schema you want to reverse engineer.

Connection string
The first argument to the command is a connection string to the database. The tools will use this connection string to read the database schema.

How you quote and escape the connection string depends on which shell you are using to execute the command. Refer to your shell's documentation for specifics. For example, PowerShell requires you to escape the $ character, but not \.

PowerShell

Copy
Scaffold-DbContext 'Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Chinook' Microsoft.EntityFrameworkCore.SqlServer
.NET Core CLI

Copy
dotnet ef dbcontext scaffold "Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Chinook" Microsoft.EntityFrameworkCore.SqlServer
Configuration and User Secrets
If you have an ASP.NET Core project, you can use the Name=<connection-string> syntax to read the connection string from configuration.

This works well with the Secret Manager tool to keep your database password separate from your codebase.

```cli
dotnet user-secrets set ConnectionStrings.Chinook "Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Chinook"
dotnet ef dbcontext scaffold Name=Chinook Microsoft.EntityFrameworkCore.SqlServer
```

Provider name
The second argument is the provider name. The provider name is typically the same as the provider's NuGet package name.

Specifying tables
All tables in the database schema are reverse engineered into entity types by default. You can limit which tables are reverse engineered by specifying schemas and tables.

The -Schemas parameter in PMC and the --schema option in the CLI can be used to include every table within a schema.

-Tables (PMC) and --table (CLI) can be used to include specific tables.

To include multiple tables in PMC, use an array.

```powershell
    Scaffold-DbContext ... -Tables Artist, Album
```
To include multiple tables in the CLI, specify the option multiple times.

```powershell
    dotnet ef dbcontext scaffold ... --table Artist --table Album
```
## Preserving names
Table and column names are fixed up to better match the .NET naming conventions for types and properties by default. Specifying the -UseDatabaseNames switch in PMC or the --use-database-names option in the CLI will disable this behavior preserving the original database names as much as possible. Invalid .NET identifiers will still be fixed and synthesized names like navigation properties will still conform to .NET naming conventions.

Fluent API or Data Annotations
Entity types are configured using the Fluent API by default. Specify -DataAnnotations (PMC) or --data-annotations (CLI) to instead use data annotations when possible.

For example, using the Fluent API will scaffold this:

```C#
    entity.Property(e => e.Title)
     .IsRequired()
      .HasMaxLength(160);
```

While using Data Annotations will scaffold this:

```C#
    [Required]
    [StringLength(160)]
    public string Title { get; set; }
```

## DbContext name
The scaffolded DbContext class name will be the name of the database suffixed with Context by default. To specify a different one, use -Context in PMC and --context in the CLI.

## Directories and namespaces
The entity classes and a DbContext class are scaffolded into the project's root directory and use the project's default namespace. You can specify the directory where classes are scaffolded using -OutputDir (PMC) or --output-dir (CLI). The namespace will be the root namespace plus the names of any subdirectories under the project's root directory.

You can also use -ContextDir (PMC) and --context-dir (CLI) to scaffold the DbContext class into a separate directory from the entity type classes.

```powershell
    Scaffold-DbContext ... -ContextDir Data -OutputDir Models
```

```powershell
    dotnet ef dbcontext scaffold ... --context-dir Data --output-dir Models
```

## How it works
Reverse engineering starts by reading the database schema. It reads information about tables, columns, constraints, and indexes.

Next, it uses the schema information to create an EF Core model. Tables are used to create entity types; columns are used to create properties; and foreign keys are used to create relationships.

Finally, the model is used to generate code. The corresponding entity type classes, Fluent API, and data annotations are scaffolded in order to re-create the same model from your app.

## Limitations

* Not everything about a model can be represented using a database  schema. For example, information about inheritance hierarchies,  owned types, and table splitting are not present in the database  schema. Because of this, these constructs will never be reverse  engineered.
* In addition, some column types may not be supported by the EF Core provider. These columns won't be included in the model.
You can define concurrency tokens, in an EF Core model to prevent two users from updating the same entity at the same time. Some  databases have a special type to represent this type of column (for example, rowversion in SQL Server) in which case we can reverse engineer this information; however, other concurrency tokens will  not be reverse engineered.
* The C# 8 nullable reference type feature is currently unsupported in reverse engineering: EF Core always generates C# code that assumes the feature is disabled. For example, nullable text columns will be scaffolded as a property with type string , not string?, with either the Fluent API or Data Annotations used to configure whether a property is required or not. You can edit the scaffolded code and replace these with C# nullability annotations. Scaffolding support for nullable reference types is tracked by issue #15520.

## Customizing the model

The code generated by EF Core is your code. Feel free to change it. It will only be regenerated if you reverse engineer the same model again. The scaffolded code represents one model that can be used to access the database, but it's certainly not the only model that can be used.

Customize the entity type classes and DbContext class to fit your needs. For example, you may choose to rename types and properties, introduce inheritance hierarchies, or split a table into to multiple entities. You can also remove non-unique indexes, unused sequences and navigation properties, optional scalar properties, and constraint names from the model.

You can also add additional constructors, methods, properties, etc. using another partial class in a separate file. This approach works even when you intend to reverse engineer the model again.

## Updating the model
After making changes to the database, you may need to update your EF Core model to reflect those changes. If the database changes are simple, it may be easiest just to manually make the changes to your EF Core model. For example, renaming a table or column, removing a column, or updating a column's type are trivial changes to make in code.

More significant changes, however, are not as easy make manually. One common workflow is to reverse engineer the model from the database again using -Force (PMC) or --force (CLI) to overwrite the existing model with an updated one.

Another commonly requested feature is the ability to update the model from the database while preserving customization like renames, type hierarchies, etc. Use issue #831 to track the progress of this feature.

>Warning
>If you reverse engineer the model from the database again, any changes you've made to the files will be lost.

## Create New Reverse Engineering Database EF Core Applicaton

1. Create the Application

To keep things simple we’re going to build a basic console application that uses Code First to perform data access:

* Open Visual Studio

* `File` -> `New` -> `Project…`

* Select `Windows` from the left menu and `Console Application`

* Enter `CodeFirstExistingDatabaseSample` as the name

* Select `OK`

2. Reverse Engineer Model

We’re going to make use of the Entity Framework Tools for Visual Studio to help us generate some initial code to map to the database. These tools are just generating code that you could also type by hand if you prefer.

* `Project` -> `Add New Item`…

* Select `Data` from the left menu and then `ADO.NET Entity - Data Model`

* Enter `BloggingContext` as the name and click `OK`

* This launches the `Entity Data Model Wizard`

* Select `Code First from Database` and click `Next`

![StepOne](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/images/wizardonecfe.png)

Select the connection to the database you created in the first section and click `Next`

![StepOne](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/images/wizardtwocfe.png)

Click the checkbox next to Tables to import all tables and click `Finish`

![StepOne](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/images/wizardthreecfe.png)

Once the reverse engineer process completes a number of items will have been added to the project, let's take a look at what's been added.
Configuration file

An appsettings.json file has been added to the project, this file contains the connection string to the existing database.

```JSON

{
  "ConnectionStrings": {
    "BloggingDatabase": "Server=(localdb)\\mssqllocaldb;Database=EFGetStarted.ConsoleApp.NewDb;Trusted_Connection=True;"
  },
}
```

You’ll notice some other settings in the configuration file too, these are default EF settings that tell Code First where to create databases. Since we are mapping to an existing database these setting will be ignored in our application.
Derived Context

A BloggingContext class has been added to the project. The context represents a session with the database, allowing us to query and save data. The context exposes a DbSet<TEntity> for each type in our model. You’ll also notice that the default constructor calls a base constructor using the name= syntax. This tells Code First that the connection string to use for this context should be loaded from the configuration file.

```C#

public partial class BloggingContext : DbContext
    {
        public BloggingContext()
            : base("name=BloggingContext")
        {
        }

        public virtual DbSet<Blog> Blogs { get; set; }
        public virtual DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }

```
You should always use the name= syntax when you are using a connection string in the config file. This ensures that if the connection string is not present then Entity Framework will throw rather than creating a new database by convention.
Model classes

Finally, a Blog and Post class have also been added to the project. These are the domain classes that make up our model. You'll see Data Annotations applied to the classes to specify configuration where the Code First conventions would not align with the structure of the existing database. For example, you'll see the StringLength annotation on Blog.Name and Blog.Url since they have a maximum length of 200 in the database (the Code First default is to use the maximun length supported by the database provider - nvarchar(max) in SQL Server).

```C#


public partial class Blog
{
    public Blog()
    {
        Posts = new HashSet<Post>();
    }

    public int BlogId { get; set; }

    [StringLength(200)]
    public string Name { get; set; }

    [StringLength(200)]
    public string Url { get; set; }

    public virtual ICollection<Post> Posts { get; set; }
}

```
4. Reading & Writing Data

Now that we have a model it’s time to use it to access some data. Implement the Main method in Program.cs as shown below. This code creates a new instance of our context and then uses it to insert a new Blog. Then it uses a LINQ query to retrieve all Blogs from the database ordered alphabetically by Title.


```C#



class Program
{
    static void Main(string[] args)
    {
        using (var db = new BloggingContext())
        {
            // Create and save a new Blog
            Console.Write("Enter a name for a new Blog: ");
            var name = Console.ReadLine();

            var blog = new Blog { Name = name };
            db.Blogs.Add(blog);
            db.SaveChanges();

            // Display all Blogs from the database
            var query = from b in db.Blogs
                        orderby b.Name
                        select b;

            Console.WriteLine("All blogs in the database:");
            foreach (var item in query)
            {
                Console.WriteLine(item.Name);
            }

            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}
```
You can now run the application and test it out.
console

Copy

Enter a name for a new Blog: ADO.NET Blog
All blogs in the database:
.NET Framework Blog
ADO.NET Blog
The Visual Studio Blog
Press any key to exit...
 
What if My Database Changes?

The Code First to Database wizard is designed to generate a starting point set of classes that you can then tweak and modify. If your database schema changes you can either manually edit the classes or perform another reverse engineer to overwrite the classes.
Using Code First Migrations to an Existing Database
If you want to use Code First Migrations with an existing database, see Code First Migrations to an existing database.
Summary

In this walkthrough we looked at Code First development using an existing database. We used the Entity Framework Tools for Visual Studio to reverse engineer a set of classes that mapped to the database and could be used to store and retrieve data.