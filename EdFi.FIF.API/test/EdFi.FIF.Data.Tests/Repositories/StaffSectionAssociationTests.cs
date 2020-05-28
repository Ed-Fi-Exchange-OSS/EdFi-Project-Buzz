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
    public class StaffSectionAssociationTests : FIFRepositoryConfiguration, IDisposable
    {
        private readonly DbConnection _connection;

        public StaffSectionAssociationTests()
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
        public void Get_staffSectionAssociation()
        {
            using (var context = new FIFContext(ContextOptions))
            {
                var repository = new StaffSectionAssociationRepository(context);
                var result = repository.GetBySection("1").Result;

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(0).SectionKey.ShouldBe("1"),
                            () => result.ElementAt(0).StaffKey.ShouldBe(1),
                            () => result.ElementAt(0).BeginDate.ShouldBe(new DateTime(2012, 01, 01)),
                            () => result.ElementAt(0).EndDate.ShouldBeNull());
            }
        }

        [Test]
        public void Get_staffSectionAssociation_returns_staffSectionAssociation()
        {
            using (var context = new FIFContext(ContextOptions))
            {
                var repository = new StaffSectionAssociationRepository(context);
                var result = repository.All().Result;

                result.Count.ShouldBe(4);

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(0).SectionKey.ShouldBe("1"),
                            () => result.ElementAt(0).StaffKey.ShouldBe(1),
                            () => result.ElementAt(0).BeginDate.ShouldBe(new DateTime(2012, 01, 01)),
                            () => result.ElementAt(0).EndDate.ShouldBeNull());

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(1).SectionKey.ShouldBe("2"),
                            () => result.ElementAt(1).StaffKey.ShouldBe(1),
                            () => result.ElementAt(1).BeginDate.ShouldBe(new DateTime(2012, 01, 01)),
                            () => result.ElementAt(1).EndDate.ShouldBeNull());

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(2).SectionKey.ShouldBe("2"),
                            () => result.ElementAt(2).StaffKey.ShouldBe(2),
                            () => result.ElementAt(2).BeginDate.ShouldBe(new DateTime(2012, 01, 01)),
                            () => result.ElementAt(2).EndDate.ShouldBeNull());

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(3).SectionKey.ShouldBe("3"),
                            () => result.ElementAt(3).StaffKey.ShouldBe(2),
                            () => result.ElementAt(3).BeginDate.ShouldBe(new DateTime(2012, 01, 01)),
                            () => result.ElementAt(3).EndDate.ShouldNotBeNull());
            }
        }

        [Test]
        public void Get_staffSectionAssociation_by_staff_returns_staffSectionAssociation()
        {
            using (var context = new FIFContext(ContextOptions))
            {
                var repository = new StaffSectionAssociationRepository(context);
                var result = repository.GetByStaff(1).Result;

                result.Count.ShouldBe(2);

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(0).SectionKey.ShouldBe("1"),
                            () => result.ElementAt(0).StaffKey.ShouldBe(1),
                            () => result.ElementAt(0).BeginDate.ShouldBe(new DateTime(2012, 01, 01)),
                            () => result.ElementAt(0).EndDate.ShouldBeNull());

                result.ShouldSatisfyAllConditions(
                    () => result.ElementAt(1).SectionKey.ShouldBe("2"),
                            () => result.ElementAt(1).StaffKey.ShouldBe(1),
                            () => result.ElementAt(1).BeginDate.ShouldBe(new DateTime(2012, 01, 01)),
                            () => result.ElementAt(1).EndDate.ShouldBeNull());
            }
        }
    }
}
