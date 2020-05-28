// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.FIF.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EdFi.FIF.Data.Configurations
{
    public class StudentContactConfiguration : IEntityTypeConfiguration<StudentContact>
    {
        public void Configure(EntityTypeBuilder<StudentContact> builder)
        {
            builder.HasKey(s => new { s.StudentSchoolKey, s.ContactPersonKey });
            builder.ToTable("StudentContact".ToLower());
        }
    }
}