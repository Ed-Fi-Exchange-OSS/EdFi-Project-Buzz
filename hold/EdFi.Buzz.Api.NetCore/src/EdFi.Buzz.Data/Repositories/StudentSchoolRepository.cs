// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.Core.Data;
using EdFi.Buzz.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EdFi.Buzz.Data.Repositories
{
    public class StudentSchoolRepository : IStudentSchoolRepository
    {
        private readonly BuzzContext _db;

        public StudentSchoolRepository(BuzzContext db)
        {
            _db = db;
        }
        public async Task<IReadOnlyList<StudentSchool>> All()
        {
            return await _db.Students.OrderBy(x => x.StudentSchoolKey).ToListAsync();
        }
        public async Task<StudentSchool> Get(string studentSchoolKey)
        {
            return await _db.Students.FirstOrDefaultAsync(p => p.StudentSchoolKey == studentSchoolKey);
        }
        public async Task<StudentSchool> GetByStudent(string studentKey)
        {
            return await _db.Students.FirstOrDefaultAsync(p => p.StudentKey == studentKey);
        }
        public async Task<IReadOnlyList<StudentSchool>> GetBySchool(string schoolKey)
        {
            return await _db.Students.Where(p => p.SchoolKey == schoolKey).OrderBy(x => x.StudentSchoolKey).ToListAsync();
        }

    }
}
