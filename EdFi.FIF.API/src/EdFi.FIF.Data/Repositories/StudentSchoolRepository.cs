// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.FIF.Core.Data;

namespace EdFi.FIF.Data.Repositories
{
    public class StudentSchoolRepository : IStudentSchoolRepository
    {
        private readonly FIFContext _db;

        public StudentSchoolRepository(FIFContext db)
        {
            _db = db;
        }
    }
}