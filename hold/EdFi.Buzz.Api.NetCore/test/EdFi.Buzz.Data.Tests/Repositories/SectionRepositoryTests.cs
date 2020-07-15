// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.Data.Repositories;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using NUnit.Framework;
using Shouldly;
using System;
using System.Data.Common;
using System.Linq;

namespace EdFi.Buzz.Data.Tests.Repositories
{
    public class SectionRepositoryTests : BuzzRepositoryConfiguration, IDisposable
    {
        private readonly DbConnection _connection;

        public SectionRepositoryTests()
        : base(
            new DbContextOptionsBuilder<BuzzContext>()
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
        public void Get_staff_by_key_returns_staff_when_it_exists()
        {
            using (var context = new BuzzContext(ContextOptions))
            {
                var repository = new SectionRepository(context);
                var result = repository.Get("1").Result;

                result.ShouldSatisfyAllConditions(
                    () => result.SectionKey.ShouldBe("1"),
                            () => result.SchoolKey.ShouldBe("1"),
                            () => result.LocalCourseCode.ShouldBe("ACER08"),
                            () => result.SessionName.ShouldBe("Traditional"),
                            () => result.SectionIdentifier.ShouldBe("21855"),
                            () => result.SchoolYear.ShouldBe<Int16>(2012));
            }
        }

        [Test]
        public void Get_staff_by_key_returns_null_when_it_does_not_exist()
        {
            using (var context = new BuzzContext(ContextOptions))
            {
                var repository = new SectionRepository(context);
                var result = repository.Get("999").Result;

                result.ShouldBeNull();
            }
        }

        [Test]
        public void Get_staff_returns_staff()
        {
            using (var context = new BuzzContext(ContextOptions))
            {
                var repository = new SectionRepository(context);
                var result = repository.All().Result;

                result.Count.ShouldBe(3);

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(0).SectionKey.ShouldBe("1"),
                            () => result.ElementAt(0).SchoolKey.ShouldBe("1"),
                            () => result.ElementAt(0).LocalCourseCode.ShouldBe("ACER08"),
                            () => result.ElementAt(0).SessionName.ShouldBe("Traditional"),
                            () => result.ElementAt(0).SectionIdentifier.ShouldBe("21855"),
                            () => result.ElementAt(0).SchoolYear.ShouldBe<Int16>(2012));

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(1).SectionKey.ShouldBe("2"),
                            () => result.ElementAt(1).SchoolKey.ShouldBe("1"),
                            () => result.ElementAt(1).LocalCourseCode.ShouldBe("ACER08"),
                            () => result.ElementAt(1).SessionName.ShouldBe("Traditional-Spring Semester"),
                            () => result.ElementAt(1).SectionIdentifier.ShouldBe("21856"),
                            () => result.ElementAt(1).SchoolYear.ShouldBe<Int16>(2012));

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(2).SectionKey.ShouldBe("3"),
                            () => result.ElementAt(2).SchoolKey.ShouldBe("2"),
                            () => result.ElementAt(2).LocalCourseCode.ShouldBe("ACER09"),
                            () => result.ElementAt(2).SessionName.ShouldBe("Traditional"),
                            () => result.ElementAt(2).SectionIdentifier.ShouldBe("21857"),
                            () => result.ElementAt(2).SchoolYear.ShouldBe<Int16>(2012));
            }
        }
    }
}
