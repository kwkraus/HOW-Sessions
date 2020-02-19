# Reverse Engineering

Reverse engineering is the process of scaffolding entity type classes and a DbContext class based on a database schema. It can be performed using the Scaffold-DbContext command of the EF Core Package Manager Console (PMC) tools or the dotnet ef dbcontext scaffold command of the .NET Command-line Interface (CLI) tools.

Installing
Before reverse engineering, you'll need to install either the [PMC tools](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/powershell) (Visual Studio only) or the [CLI tools](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet). See links for details.

1. Create the Application

To keep things simple we’re going to build a basic console application that uses Code First to perform data access:

* Open Visual Studio

* `Create a new project` -> `Console App(.Net Core)` -> `Next` 

* Configure your new project  -> Project Name `ExistingDatabaseSample`

* Select `Create`

2. Install Nuget packages:

* Right `click` on project select `Manage Nuget Packages...` 
* Click `Browse` and past in the below in search and install each nuget package.

* Microsoft.EntityFrameworkCore.SqlServer
* Microsoft.EntityFrameworkCore.Tools
* Microsoft.VisualStudio.Web.CodeGeneration.Design


You'll also need to install an appropriate [database provider](https://docs.microsoft.com/en-us/ef/core/providers/index?tabs=dotnet-core-cli) for the database schema you want to reverse engineer.

In our case the is Microsoft.EntityFrameworkCore.SqlServer.

## Connection string

The first argument to the command is a connection string to the database. The tools will use this connection string to read the database schema.

How you quote and escape the connection string depends on which shell you are using to execute the command. Refer to your shell's documentation for specifics. For example, PowerShell requires you to escape the $ character, but not \.

PowerShell

```powershell
Scaffold-DbContext 'Scaffold-DbContext 'Data Source=.;Initial Catalog=Blogging;Integrated Security=True' Microsoft.EntityFrameworkCore.SqlServer' Microsoft.EntityFrameworkCore.SqlServer
```

.NET Core CLI

```cli
dotnet ef dbcontext scaffold "Scaffold-DbContext 'Data Source=.;Initial Catalog=Blogging;Integrated Security=True' Microsoft.EntityFrameworkCore.SqlServer" Microsoft.EntityFrameworkCore.SqlServer
```


## Derived Context

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

```console
Enter a name for a new Blog: ADO.NET Blog
All blogs in the database:
.NET Framework Blog
ADO.NET Blog
The Visual Studio Blog
Press any key to exit...
```

## Taking a Closer look


You'll also need to install an appropriate [database provider](https://docs.microsoft.com/en-us/ef/core/providers/index?tabs=dotnet-core-cli) for the database schema you want to reverse engineer.

Connection string
The first argument to the command is a connection string to the database. The tools will use this connection string to read the database schema.

How you quote and escape the connection string depends on which shell you are using to execute the command. Refer to your shell's documentation for specifics. For example, PowerShell requires you to escape the $ character, but not \.

PowerShell

```powershell
Scaffold-DbContext 'Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Chinook' Microsoft.EntityFrameworkCore.SqlServer
```

.NET Core CLI

```cli
dotnet ef dbcontext scaffold "Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Chinook" Microsoft.EntityFrameworkCore.SqlServer
```

## Configuration and User Secrets

If you have an ASP.NET Core project, you can use the `Name=<connection-string>` syntax to read the connection string from configuration.

This works well with the Secret Manager tool to keep your database password separate from your codebase.

```cli
dotnet user-secrets set ConnectionStrings.Chinook "Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Chinook"
dotnet ef dbcontext scaffold Name=Chinook Microsoft.EntityFrameworkCore.SqlServer
```

## Provider name

The second argument is the provider name. The provider name is typically the same as the provider's NuGet package name.

## Specifying tables

All tables in the database schema are reverse engineered into entity types by default. You can limit which tables are reverse engineered by specifying schemas and tables.

The `-Schemas` parameter in PMC and the `--schema` option in the CLI can be used to include every table within a schema.

`-Tables` (PMC) and `--table` (CLI) can be used to include specific tables.

To include multiple tables in PMC, use an array.

### Powershell

```powershell
    Scaffold-DbContext ... -Tables Artist, Album
```

To include multiple tables in the CLI, specify the option multiple times.

### .Net Core CLI

```cli
    dotnet ef dbcontext scaffold ... --table Artist --table Album
```

## Preserving names

Table and column names are fixed up to better match the .NET naming conventions for types and properties by default. Specifying the -UseDatabaseNames switch in PMC or the --use-database-names option in the CLI will disable this behavior preserving the original database names as much as possible. Invalid .NET identifiers will still be fixed and synthesized names like navigation properties will still conform to .NET naming conventions.

## Fluent API or Data Annotations

Entity types are configured using the Fluent API by default. Specify -DataAnnotations (PMC) or --data-annotations (CLI) to instead use data annotations when possible.

For example, using the Fluent API will scaffold this:

### C#

```C#
    entity.Property(e => e.Title)
     .IsRequired()
      .HasMaxLength(160);
```

While using Data Annotations will scaffold this:

### C#

```C#
    [Required]
    [StringLength(160)]
    public string Title { get; set; }
```

## DbContext name

The scaffolded DbContext class name will be the name of the database suffixed with Context by default. To specify a different one, use `-Context` in PMC and `--context` in the CLI.

## Directories and namespaces

The entity classes and a DbContext class are scaffolded into the project's root directory and use the project's default namespace. You can specify the directory where classes are scaffolded using `-OutputDir` (PMC) or `--output-dir` (CLI). The namespace will be the root namespace plus the names of any subdirectories under the project's root directory.

You can also use `-ContextDir` (PMC) and `--context-dir` (CLI) to scaffold the DbContext class into a separate directory from the entity type classes.

### Powershell 

```powershell
Scaffold-DbContext ... -ContextDir Data -OutputDir Models
```

### .Net Core CLI

```powershell
dotnet ef dbcontext scaffold ... --context-dir Data --output-dir Models
```

## How it works

Reverse engineering starts by reading the database schema. It reads information about tables, columns, constraints, and indexes.

Next, it uses the schema information to create an EF Core model. Tables are used to create entity types; columns are used to create properties; and foreign keys are used to create relationships.

Finally, the model is used to generate code. The corresponding entity type classes, Fluent API, and data annotations are scaffolded in order to re-create the same model from your app.

## Limitations

* Not everything about a model can be represented using a database  schema. For example, information about **[inheritance hierarchies](https://docs.microsoft.com/en-us/ef/core/modeling/inheritance),  [owned types](https://docs.microsoft.com/en-us/ef/core/modeling/owned-entities)**, and [**table splitting**](https://docs.microsoft.com/en-us/ef/core/modeling/table-splitting) are not present in the database  schema. Because of this, these constructs will never be reverse  engineered.

* In addition, **some column types** may not be supported by the EF Core provider. These columns won't be included in the model.
You can define [**concurrency tokens**](https://docs.microsoft.com/en-us/ef/core/modeling/concurrency?tabs=data-annotations), in an EF Core model to prevent two users from updating the same entity at the same time. Some  databases have a special type to represent this type of column (for example, rowversion in SQL Server) in which case we can reverse engineer this information; however, other concurrency tokens will  not be reverse engineered.

* **The C# 8 nullable reference type feature** is currently unsupported in reverse engineering: EF Core always generates C# code that assumes the feature is disabled. For example, nullable text columns will be scaffolded as a property with type string , not string?, with either the Fluent API or Data Annotations used to configure whether a property is required or not. You can edit the scaffolded code and replace these with C# nullability annotations. Scaffolding support for nullable reference types is tracked by issue [#15520](https://github.com/dotnet/efcore/issues/15520).

## Customizing the model

The code generated by EF Core is your code. Feel free to change it. It will only be regenerated if you reverse engineer the same model again. The scaffolded code represents one model that can be used to access the database, but it's certainly not the only model that can be used.

Customize the entity type classes and DbContext class to fit your needs. For example, you may choose to rename types and properties, introduce inheritance hierarchies, or split a table into to multiple entities. You can also remove non-unique indexes, unused sequences and navigation properties, optional scalar properties, and constraint names from the model.

You can also add additional constructors, methods, properties, etc. using another partial class in a separate file. This approach works even when you intend to reverse engineer the model again.

## Updating the model

After making changes to the database, you may need to update your EF Core model to reflect those changes. If the database changes are simple, it may be easiest just to manually make the changes to your EF Core model. For example, renaming a table or column, removing a column, or updating a column's type are trivial changes to make in code.

More significant changes, however, are not as easy make manually. One common workflow is to reverse engineer the model from the database again using `-Force` (PMC) or `--force` (CLI) to overwrite the existing model with an updated one.

Another commonly requested feature is the ability to update the model from the database while preserving customization like renames, type hierarchies, etc. Use issue [#831](https://github.com/dotnet/efcore/issues/831) to track the progress of this feature.


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




>Warning
>If you reverse engineer the model from the database again, any changes you've made to the files will be lost.

## Create DataBase 

1. Create an Existing Database
Typically when you are targeting an existing database it will already be created, but for this walkthrough we need to create a database to access.

* Let's go ahead and generate the database.

* Open Visual Studio

* View -> Server Explorer

* Right click on Data Connections -> Add Connection…

* If you haven’t connected to a database from Server Explorer before you’ll need to select Microsoft SQL Server as the data source

![Select Data Source](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/images/selectdatasource.png)

Connect to your LocalDB instance, and enter Blogging as the database name

![LocalDB Connection](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/images/localdbconnection.png)

Select **OK** and you will be asked if you want to create a new database, select Yes

![Create Database Dialog](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/images/createdatabasedialog.png)

* The new database will now appear in Server Explorer, right-click on it and select **New Query**

* Copy the following SQL into the new query, then right-click on the query and select **Execute**


[SQL Click here open file copy and paste](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/Scripts/instnwnd.sql)



# Reverse Engineering with EF Core Power Tools 


[How to Install Extensions](https://docs.microsoft.com/en-us/visualstudio/ide/finding-and-using-visual-studio-extensions?view=vs-2019)


Generate POCO classes, derived DbContext and mapping for an existing database using EFCore PowerTools

[Power Tools Reverser Engineer](https://github.com/ErikEJ/EFCorePowerTools/wiki/Reverse-Engineering)

[EntityFramework Reverse POCO Generator](https://marketplace.visualstudio.com/items?itemName=SimonHughes.EntityFrameworkReversePOCOGenerator)

[EntityFramework-Reverse-POCO-Code-First-Generator](https://github.com/sjh37/EntityFramework-Reverse-POCO-Code-First-Generator)


## Stored Procedures

```C#
public List<EmployeeSalesByCountryReturnModel> EmployeeSalesByCountry(DateTime? beginningDate, DateTime? endingDate, out int procResult)
        {
            var beginningDateParam = new SqlParameter { ParameterName = "@Beginning_Date", SqlDbType = SqlDbType.DateTime, Direction = ParameterDirection.Input, Value = beginningDate.GetValueOrDefault() };
            if (!beginningDate.HasValue)
                beginningDateParam.Value = DBNull.Value;

            var endingDateParam = new SqlParameter { ParameterName = "@Ending_Date", SqlDbType = SqlDbType.DateTime, Direction = ParameterDirection.Input, Value = endingDate.GetValueOrDefault() };
            if (!endingDate.HasValue)
                endingDateParam.Value = DBNull.Value;

            var procResultParam = new SqlParameter { ParameterName = "@procResult", SqlDbType = SqlDbType.Int, Direction = ParameterDirection.Output };
            const string sqlCommand = "EXEC @procResult = [dbo].[Employee Sales by Country] @Beginning_Date, @Ending_Date";
            var procResultData = Set<EmployeeSalesByCountryReturnModel>()
                .FromSqlRaw(sqlCommand, beginningDateParam, endingDateParam, procResultParam)
                .ToList();

            procResult = (int) procResultParam.Value;
            return procResultData;
        }
```

[Code First Insert, Update, and Delete Stored Procedures](https://docs.microsoft.com/en-us/ef/ef6/modeling/code-first/fluent/cud-stored-procedures)


[EF Core How](https://github.com/kwkraus/HOW-Sessions/blob/master/sessions/entityframeworkcore/Ef_Core_How.md)