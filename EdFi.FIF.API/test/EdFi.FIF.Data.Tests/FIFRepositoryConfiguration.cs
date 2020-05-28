// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.FIF.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace EdFi.FIF.Data.Tests
{
    public class FIFRepositoryConfiguration
    {
        protected FIFRepositoryConfiguration(DbContextOptions<FIFContext> contextOptions)
        {
            ContextOptions = contextOptions;

            Seed();
        }
        protected DbContextOptions<FIFContext> ContextOptions { get; }

        private void Seed()
        {
            using (var context = new FIFContext(ContextOptions))
            {
                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();

                var studentSchools = new List<StudentSchool>()
                {
                    new StudentSchool()
                    {
                        StudentSchoolKey = "1-1",
                        SchoolKey = "1",
                        SchoolYear = "2012",
                        StudentKey = "1",
                        StudentFirstName = "Tommas",
                        StudentLastName = "McCarthy",
                        EnrollmentDateKey = "20120101",
                        GradeLevel = "Ninth grade"
                    },
                    new StudentSchool()
                    {
                        StudentSchoolKey = "2-1",
                        SchoolKey = "1",
                        SchoolYear = "2012",
                        StudentKey = "2",
                        StudentFirstName = "Matthew",
                        StudentLastName = "Simpson",
                        EnrollmentDateKey = "20120101",
                        GradeLevel = "Eighth grade",
                        IsHispanic = true,
                        Sex = "Male"
                    }
                };

                var staff = new List<Staff>()
                {
                    new Staff()
                    {
                        StaffKey = 1,
                        StaffUniqueId = "1",
                        PersonalTitlePrefix = "Sr.",
                        FirstName = "Joe",
                        LastSurname = "Doe",
                        MiddleName = "J."
                    },
                    new Staff()
                    {
                        StaffKey = 2,
                        StaffUniqueId = "2",
                        PersonalTitlePrefix = "Sr.",
                        FirstName = "Cody",
                        LastSurname = "Smith",
                        MiddleName = "C."
                    }
                };

                var sections = new List<Section>()
                {
                    new Section()
                    {
                        SectionKey = "1",
                        SchoolKey = "1",
                        SchoolYear = 2012,
                        SessionName = "Traditional",
                        SectionIdentifier = "21855",
                        LocalCourseCode = "ACER08"
                    },
                    new Section()
                    {
                        SectionKey = "2",
                        SchoolKey = "1",
                        SchoolYear = 2012,
                        SessionName = "Traditional-Spring Semester",
                        SectionIdentifier = "21856",
                        LocalCourseCode = "ACER08"
                    },
                    new Section()
                    {
                        SectionKey = "3",
                        SchoolKey = "2",
                        SchoolYear = 2012,
                        SessionName = "Traditional",
                        SectionIdentifier = "21857",
                        LocalCourseCode = "ACER09"
                    }
                };

                var staffSectionAssociation = new List<StaffSectionAssociation>()
                {
                    new StaffSectionAssociation()
                    {
                        StaffKey = 1,
                        SectionKey = "1",
                        BeginDate = new DateTime(2012,01,01)
                    },
                    new StaffSectionAssociation()
                    {
                        StaffKey = 1,
                        SectionKey = "2",
                        BeginDate = new DateTime(2012,01,01)
                    },
                    new StaffSectionAssociation()
                    {
                        StaffKey = 2,
                        SectionKey = "2",
                        BeginDate = new DateTime(2012,01,01)
                    },
                    new StaffSectionAssociation()
                    {
                        StaffKey = 2,
                        SectionKey = "3",
                        BeginDate = new DateTime(2012,01,01),
                        EndDate = DateTime.Now.AddDays(1)
                    }
                };

                context.AddRange(studentSchools);
                context.AddRange(sections);
                context.AddRange(staff);
                context.AddRange(staffSectionAssociation);

                context.SaveChanges();
            }
        }
    }
}
