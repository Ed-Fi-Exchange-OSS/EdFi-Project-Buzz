// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.FIF.Core.Data;

namespace EdFi.FIF.Data.Repositories
{
    public class StudentSectionRepository : IStudentSectionRepository
    {
        private readonly FIFContext _db;

        public StudentSectionRepository(FIFContext db)
        {
            _db = db;
        }
    }
}