// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.Core.Data;
using EdFi.Buzz.Data;
using EdFi.Buzz.Data.Repositories;
using EdFi.Buzz.GraphQL.Helpers;
using EdFi.Buzz.GraphQL.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace EdFi.Buzz.GraphQL
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
            // configure strongly typed settings objects
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();

            //var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            services.AddMvcCore(option => option.EnableEndpointRouting = false)
                .AddNewtonsoftJson();
            services.AddCors(options => options.AddPolicy("AllowPWAOrigin", builder =>
               builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()));
            services.AddHttpContextAccessor();
            services.AddSingleton<IContextServiceLocator, ContextServiceLocator>();
            services.AddSingleton<ContextServiceLocator>();
            services.AddDbContext<BuzzContext>(options =>
            {
                options.UseSqlServer(Configuration["ConnectionStrings:BuzzDbSqlServer"]);
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }, ServiceLifetime.Transient);
            //Repositories
            services.AddTransient<IContactPersonRepository, ContactPersonRepository>();
            services.AddTransient<ISectionRepository, SectionRepository>();
            services.AddTransient<IStaffRepository, StaffRepository>();
            services.AddTransient<IStaffSectionAssociationRepository, StaffSectionAssociationRepository>();
            services.AddTransient<IStudentContactRepository, StudentContactRepository>();
            services.AddTransient<IStudentSchoolRepository, StudentSchoolRepository>();
            services.AddTransient<IStudentSectionRepository, StudentSectionRepository>();

            services.AddSingleton<IDocumentExecuter, DocumentExecuter>();
            //GraphQL
            services.AddSingleton<BuzzQuery>();
            services.AddSingleton<ContactPersonType>();
            services.AddSingleton<SectionType>();
            services.AddSingleton<StaffType>();
            services.AddSingleton<StaffSectionAssociationType>();
            services.AddSingleton<StudentContactType>();
            services.AddSingleton<StudentSchoolType>();
            services.AddSingleton<StudentSectionType>();

            //services.AddScoped<IUserContext, UserContext>();
            //services.AddScoped<IUserService, UserService>();
            var sp = services.BuildServiceProvider();

            services.AddSingleton<ISchema>(new BuzzSchema
                (new FuncServiceProvider(type => sp.GetService(type))));

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            //app.UseAuthorization();
            app.UseCors(options => options
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            app.UseMvc();
        }
    }
}
