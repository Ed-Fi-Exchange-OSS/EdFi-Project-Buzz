// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.FIF.Data.Repositories;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using NUnit.Framework;
using Shouldly;
using System;
using System.Data.Common;
using System.Linq;

namespace EdFi.FIF.Data.Tests.Repositories
{
    public class StudentSchoolRepositoryTests : FIFRepositoryConfiguration, IDisposable
    {
        private readonly DbConnection _connection;

        public StudentSchoolRepositoryTests()
        : base(
            new DbContextOptionsBuilder<FIFContext>()
                .UseSqlite(CreateInMemoryDatabase())
                .Options)
        {
            _connection = RelationalOptionsExtension.Extract(ContextOptions).Connection;
        }

        private static DbConnection CreateInMemoryDatabase()
        {
            var connection = new SqliteConnection("Filename=:memory:");

            connection.Open();

            return connection;
        }

        public void Dispose() => _connection.Dispose();

        [Test]
        public void Get_all_studentschools_returns_studentschools()
        {
            using (var context = new FIFContext(ContextOptions))
            {
                var repository = new StudentSchoolRepository(context);
                var result = repository.All().Result;

                result.Count.ShouldBe(2);

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(0).StudentSchoolKey.ShouldBe("1-1"),
                            () => result.ElementAt(0).StudentKey.ShouldBe("1"),
                            () => result.ElementAt(0).SchoolKey.ShouldBe("1"),
                            () => result.ElementAt(0).SchoolYear.ShouldBe("2012"),
                            () => result.ElementAt(0).StudentFirstName.ShouldBe("Tommas"),
                            () => result.ElementAt(0).StudentMiddleName.ShouldBeNull(),
                            () => result.ElementAt(0).StudentLastName.ShouldBe("McCarthy"),
                            () => result.ElementAt(0).EnrollmentDateKey.ShouldBe("20120101"),
                            () => result.ElementAt(0).GradeLevel.ShouldBe("Ninth grade"),
                            () => result.ElementAt(0).PictureURL.ShouldBe("Some url for the picture"),
                            () => result.ElementAt(0).LimitedEnglishProficiency.ShouldBeNull(),
                            () => result.ElementAt(0).IsHispanic.ShouldBe(false),
                            () => result.ElementAt(0).Sex.ShouldBeNull());

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(1).StudentSchoolKey.ShouldBe("2-1"),
                            () => result.ElementAt(1).StudentKey.ShouldBe("2"),
                            () => result.ElementAt(1).SchoolKey.ShouldBe("1"),
                            () => result.ElementAt(1).SchoolYear.ShouldBe("2012"),
                            () => result.ElementAt(1).StudentFirstName.ShouldBe("Matthew"),
                            () => result.ElementAt(1).StudentMiddleName.ShouldBeNull(),
                            () => result.ElementAt(1).StudentLastName.ShouldBe("Simpson"),
                            () => result.ElementAt(1).EnrollmentDateKey.ShouldBe("20120101"),
                            () => result.ElementAt(1).GradeLevel.ShouldBe("Eighth grade"),
                            () => result.ElementAt(1).LimitedEnglishProficiency.ShouldBeNull(),
                            () => result.ElementAt(1).IsHispanic.ShouldBe(true),
                            () => result.ElementAt(1).Sex.ShouldBe("Male"));
            }
        }

        [Test]
        public void Get_StudentSchool_by_studentSchoolKey_returns_StudentSchool()
        {
            using (var context = new FIFContext(ContextOptions))
            {
                var repository = new StudentSchoolRepository(context);
                var result = repository.Get("1-1").Result;

                result.ShouldSatisfyAllConditions(
                    () => result.StudentSchoolKey.ShouldBe("1-1"),
                            () => result.StudentKey.ShouldBe("1"),
                            () => result.SchoolKey.ShouldBe("1"),
                            () => result.SchoolYear.ShouldBe("2012"),
                            () => result.StudentFirstName.ShouldBe("Tommas"),
                            () => result.StudentMiddleName.ShouldBeNull(),
                            () => result.StudentLastName.ShouldBe("McCarthy"),
                            () => result.EnrollmentDateKey.ShouldBe("20120101"),
                            () => result.GradeLevel.ShouldBe("Ninth grade"),
                            () => result.LimitedEnglishProficiency.ShouldBeNull(),
                            () => result.IsHispanic.ShouldBe(false),
                            () => result.Sex.ShouldBeNull(),
                            () => result.PictureURL.ShouldBe("Some url for the picture"));
            }
        }

        [Test]
        public void Get_StudentSchool_by_studentSchoolKey_returns_null_when_it_does_not_exist()
        {
            using (var context = new FIFContext(ContextOptions))
            {
                var repository = new StudentSchoolRepository(context);
                var result = repository.Get("1-999").Result;

                result.ShouldBeNull();
            }
        }

        [Test]
        public void Get_StudentSchool_by_studentKey_returns_StudentSchool()
        {
            using (var context = new FIFContext(ContextOptions))
            {
                var repository = new StudentSchoolRepository(context);
                var result = repository.GetByStudent("1").Result;

                result.ShouldSatisfyAllConditions(
                    () => result.StudentSchoolKey.ShouldBe("1-1"),
                            () => result.StudentKey.ShouldBe("1"),
                            () => result.SchoolKey.ShouldBe("1"),
                            () => result.SchoolYear.ShouldBe("2012"),
                            () => result.StudentFirstName.ShouldBe("Tommas"),
                            () => result.StudentMiddleName.ShouldBeNull(),
                            () => result.StudentLastName.ShouldBe("McCarthy"),
                            () => result.EnrollmentDateKey.ShouldBe("20120101"),
                            () => result.GradeLevel.ShouldBe("Ninth grade"),
                            () => result.LimitedEnglishProficiency.ShouldBeNull(),
                            () => result.IsHispanic.ShouldBe(false),
                            () => result.Sex.ShouldBeNull(),
                            () => result.PictureURL.ShouldBe("Some url for the picture"));
            }
        }

        [Test]
        public void Get_StudentSchool_by_schoolKey_returns_StudentSchool()
        {
            using (var context = new FIFContext(ContextOptions))
            {
                var repository = new StudentSchoolRepository(context);
                var result = repository.GetBySchool("1").Result;

                result.Count.ShouldBe(2);

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(0).StudentSchoolKey.ShouldBe("1-1"),
                            () => result.ElementAt(0).StudentKey.ShouldBe("1"),
                            () => result.ElementAt(0).SchoolKey.ShouldBe("1"),
                            () => result.ElementAt(0).SchoolYear.ShouldBe("2012"),
                            () => result.ElementAt(0).StudentFirstName.ShouldBe("Tommas"),
                            () => result.ElementAt(0).StudentMiddleName.ShouldBeNull(),
                            () => result.ElementAt(0).StudentLastName.ShouldBe("McCarthy"),
                            () => result.ElementAt(0).EnrollmentDateKey.ShouldBe("20120101"),
                            () => result.ElementAt(0).GradeLevel.ShouldBe("Ninth grade"),
                            () => result.ElementAt(0).LimitedEnglishProficiency.ShouldBeNull(),
                            () => result.ElementAt(0).IsHispanic.ShouldBe(false),
                            () => result.ElementAt(0).Sex.ShouldBeNull(),
                            () => result.ElementAt(0).PictureURL.ShouldBe("Some url for the picture"));

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(1).StudentSchoolKey.ShouldBe("2-1"),
                            () => result.ElementAt(1).StudentKey.ShouldBe("2"),
                            () => result.ElementAt(1).SchoolKey.ShouldBe("1"),
                            () => result.ElementAt(1).SchoolYear.ShouldBe("2012"),
                            () => result.ElementAt(1).StudentFirstName.ShouldBe("Matthew"),
                            () => result.ElementAt(1).StudentMiddleName.ShouldBeNull(),
                            () => result.ElementAt(1).StudentLastName.ShouldBe("Simpson"),
                            () => result.ElementAt(1).EnrollmentDateKey.ShouldBe("20120101"),
                            () => result.ElementAt(1).GradeLevel.ShouldBe("Eighth grade"),
                            () => result.ElementAt(1).LimitedEnglishProficiency.ShouldBeNull(),
                            () => result.ElementAt(1).IsHispanic.ShouldBe(true),
                            () => result.ElementAt(1).Sex.ShouldBe("Male"));
            }
        }
    }
}
