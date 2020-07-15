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
    public class StaffRepositoryTests : BuzzRepositoryConfiguration, IDisposable
    {
        private readonly DbConnection _connection;

        public StaffRepositoryTests()
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
                var repository = new StaffRepository(context);
                var result = repository.Get(1).Result;

                result.ShouldSatisfyAllConditions(
                    () => result.StaffKey.ShouldBe(1),
                            () => result.PersonalTitlePrefix.ShouldBe("Sr."),
                            () => result.FirstName.ShouldBe("Joe"),
                            () => result.MiddleName.ShouldBe("J."),
                            () => result.LastSurname.ShouldBe("Doe"),
                            () => result.StaffUniqueId.ShouldBe("1"));
            }
        }

        [Test]
        public void Get_staff_by_key_returns_null_when_it_does_not_exist()
        {
            using (var context = new BuzzContext(ContextOptions))
            {
                var repository = new StaffRepository(context);
                var result = repository.Get(999).Result;

                result.ShouldBeNull();
            }
        }

        [Test]
        public void Get_staff_returns_staff()
        {
            using (var context = new BuzzContext(ContextOptions))
            {
                var repository = new StaffRepository(context);
                var result = repository.All().Result;

                result.Count.ShouldBe(2);

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(0).StaffKey.ShouldBe(1),
                            () => result.ElementAt(0).PersonalTitlePrefix.ShouldBe("Sr."),
                            () => result.ElementAt(0).FirstName.ShouldBe("Joe"),
                            () => result.ElementAt(0).MiddleName.ShouldBe("J."),
                            () => result.ElementAt(0).LastSurname.ShouldBe("Doe"),
                            () => result.ElementAt(0).StaffUniqueId.ShouldBe("1"));

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(1).StaffKey.ShouldBe(2),
                        () => result.ElementAt(1).PersonalTitlePrefix.ShouldBe("Sr."),
                        () => result.ElementAt(1).FirstName.ShouldBe("Cody"),
                        () => result.ElementAt(1).MiddleName.ShouldBe("C."),
                        () => result.ElementAt(1).LastSurname.ShouldBe("Smith"),
                        () => result.ElementAt(1).StaffUniqueId.ShouldBe("2"));
            }
        }
    }
}
