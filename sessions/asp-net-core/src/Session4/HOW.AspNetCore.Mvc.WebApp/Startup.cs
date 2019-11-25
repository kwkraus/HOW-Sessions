using HOW.AspNetCore.Data.Contexts;
using HOW.AspNetCore.Services.Domains;
using HOW.AspNetCore.Services.Interfaces;
using HOW.AspNetCore.Services.Options;
using HOW.AspNetCore.Services.Storage;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace HOW.AspNetCore.Mvc.WebApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            services.AddDbContext<HowDataContext>(options =>
                options.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=HowAspNetCoreDb;Trusted_Connection=True;MultipleActiveResultSets=true"));

            services.Configure<AzureBlobServiceOptions>(Configuration.GetSection("AzureBlobStorage"));

            services.AddScoped<IProductService, ProductService>();
            services.AddTransient<IStorageService, AzureBlobService>();


            //uncomment to demonstrate lifetime and registration options
            //services.AddTransient<IOperationTransient, Operation>();
            //services.AddScoped<IOperationScoped, Operation>();
            //services.AddSingleton<IOperationSingleton, Operation>();
            //services.AddSingleton<IOperationSingletonInstance>(new Operation(Guid.Empty));

            //// OperationService depends on each of the other Operation types.
            //services.AddTransient<OperationService, OperationService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
