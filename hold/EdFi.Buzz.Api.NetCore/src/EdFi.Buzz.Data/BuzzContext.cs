// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.Core.Models;
using EdFi.Buzz.Data.Configurations;
using Microsoft.EntityFrameworkCore;
// ReSharper disable InconsistentNaming

namespace EdFi.Buzz.Data
{
    public class BuzzContext : DbContext
    {
        public BuzzContext(DbContextOptions options)
            : base(options)
        {
        }
        public DbSet<ContactPerson> Contacts { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<StudentSchool> Students { get; set; }
        public DbSet<StudentContact> StudentContacts { get; set; }
        public DbSet<StudentSection> StudentSections { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<StaffSectionAssociation> StaffSectionAssociations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema("buzz");

            modelBuilder.ApplyConfiguration(new ContactPersonConfiguration());
            modelBuilder.ApplyConfiguration(new SectionConfiguration());
            modelBuilder.ApplyConfiguration(new StaffConfiguration());
            modelBuilder.ApplyConfiguration(new StaffSectionAssociationConfiguration());
            modelBuilder.ApplyConfiguration(new StudentContactConfiguration());
            modelBuilder.ApplyConfiguration(new StudentSchoolConfiguration());
            modelBuilder.ApplyConfiguration(new StudentSectionConfiguration());
        }
    }
}
