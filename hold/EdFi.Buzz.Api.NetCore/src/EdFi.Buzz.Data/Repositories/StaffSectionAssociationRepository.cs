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
    public class StaffSectionAssociationRepository : IStaffSectionAssociationRepository
    {
        private readonly BuzzContext _db;

        public StaffSectionAssociationRepository(BuzzContext db)
        {
            _db = db;
        }

        public async Task<IReadOnlyList<StaffSectionAssociation>> All()
        {
            return await _db.StaffSectionAssociations.OrderBy(x => x.StaffKey).ThenBy(x => x.SectionKey).ToListAsync();
        }

        public async Task<IReadOnlyList<StaffSectionAssociation>> GetBySection(string sectionKey)
        {
            return await _db.StaffSectionAssociations.Where(p => p.SectionKey == sectionKey).OrderBy(x => x.StaffKey).ThenBy(x => x.SectionKey).ToListAsync();
        }

        public async Task<IReadOnlyList<StaffSectionAssociation>> GetByStaff(int staffKey)
        {
            return await _db.StaffSectionAssociations.Where(p => p.StaffKey == staffKey).OrderBy(x => x.StaffKey).ThenBy(x => x.SectionKey).ToListAsync();
        }
    }
}