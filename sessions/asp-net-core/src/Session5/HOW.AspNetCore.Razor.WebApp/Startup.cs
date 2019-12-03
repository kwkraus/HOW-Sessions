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

namespace HOW.AspNet.WebApp
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
            services.AddRazorPages();

            services.AddDbContext<HowDataContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.Configure<AzureBlobServiceOptions>(Configuration.GetSection("AzureBlobServiceOptions"));

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

            //#region snippet_DevPageAndHandlerPage
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Error");
            //    app.UseHsts();
            //}
            //#endregion

            //#region snippet_HandlerPageLambda
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //else
            //{
            //   app.UseExceptionHandler(errorApp =>
            //   {
            //        errorApp.Run(async context =>
            //        {
            //            context.Response.StatusCode = 500;
            //            context.Response.ContentType = "text/html";

            //            await context.Response.WriteAsync("<html lang=\"en\"><body>\r\n");
            //            await context.Response.WriteAsync("ERROR!<br><br>\r\n");

            //            var exceptionHandlerPathFeature = 
            //                context.Features.Get<IExceptionHandlerPathFeature>();

            //            // Use exceptionHandlerPathFeature to process the exception (for example, 
            //            // logging), but do NOT expose sensitive error information directly to 
            //            // the client.

            //            if (exceptionHandlerPathFeature?.Error is FileNotFoundException)
            //            {
            //                await context.Response.WriteAsync("File error thrown!<br><br>\r\n");
            //            }

            //            await context.Response.WriteAsync("<a href=\"/\">Home</a><br>\r\n");
            //            await context.Response.WriteAsync("</body></html>\r\n");
            //            await context.Response.WriteAsync(new string(' ', 512)); // IE padding
            //        });
            //    });
            //    app.UseHsts();
            //}
            //#endregion

            //#region snippet_StatusCodePages
            //app.UseStatusCodePages();
            //#endregion

            //#region snippet_StatusCodePagesFormatString
            //app.UseStatusCodePages(
            //    "text/plain", "Status code page, status code: {0}");
            //#endregion

            #region snippet_StatusCodePagesWithRedirect
            app.UseStatusCodePagesWithRedirects("/StatusCode?code={0}");
            #endregion

            //#region snippet_StatusCodePagesWithReExecute
            //app.UseStatusCodePagesWithReExecute("/StatusCode","?code={0}");
            //#endregion

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
            });
        }
    }
}
