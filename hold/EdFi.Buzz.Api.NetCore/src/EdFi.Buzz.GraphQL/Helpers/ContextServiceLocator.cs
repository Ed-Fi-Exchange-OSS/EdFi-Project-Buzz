// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.Core.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace EdFi.Buzz.GraphQL.Helpers
{
    public class ContextServiceLocator : IContextServiceLocator
    {
        public IStudentSchoolRepository StudentSchoolRepository => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IStudentSchoolRepository>();

        public IContactPersonRepository ContactPersonRepository => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IContactPersonRepository>();

        public ISectionRepository SectionRepository => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<ISectionRepository>();

        public IStaffRepository StaffRepository => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IStaffRepository>();

        public IStaffSectionAssociationRepository StaffSectionAssociationRepository => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IStaffSectionAssociationRepository>();

        public IStudentContactRepository StudentContactRepository => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IStudentContactRepository>();

        public IStudentSectionRepository StudentSectionRepository => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IStudentSectionRepository>();

        private readonly IHttpContextAccessor _httpContextAccessor;

        public ContextServiceLocator(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
    }
}