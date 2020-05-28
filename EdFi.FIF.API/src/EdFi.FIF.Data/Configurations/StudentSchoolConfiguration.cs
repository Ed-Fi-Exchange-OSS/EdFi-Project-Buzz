// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.FIF.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EdFi.FIF.Data.Configurations
{
    public class StudentSchoolConfiguration : IEntityTypeConfiguration<StudentSchool>
    {
        public void Configure(EntityTypeBuilder<StudentSchool> builder)
        {
            builder.HasKey(s => s.StudentSchoolKey);
            builder.ToTable("StudentSchool".ToLower());
        }
    }
}