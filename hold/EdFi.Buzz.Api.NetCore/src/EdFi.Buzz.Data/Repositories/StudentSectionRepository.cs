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
    public class StudentSectionRepository : IStudentSectionRepository
    {
        private readonly BuzzContext _db;

        public StudentSectionRepository(BuzzContext db)
        {
            _db = db;
        }

        public async Task<IReadOnlyList<StudentSection>> All()
        {
            return await _db.StudentSections.OrderBy(x => x.StudentSectionKey).ToListAsync();
        }

        public async Task<StudentSection> Get(string studentSectionKey)
        {
            return await _db.StudentSections.FirstOrDefaultAsync(p => p.StudentSectionKey == studentSectionKey);
        }

        public async Task<IReadOnlyList<StudentSection>> GetByStudent(string studentKey)
        {
            return await _db.StudentSections.Where(p => p.StudentSchoolKey == studentKey).OrderBy(x => x.StudentSectionKey).ToListAsync();
        }

        public async Task<IReadOnlyList<StudentSection>> GetBySection(string sectionKey)
        {
            return await _db.StudentSections.Where(p => p.SectionKey == sectionKey).OrderBy(x => x.StudentSectionKey).ToListAsync();
        }
    }
}
