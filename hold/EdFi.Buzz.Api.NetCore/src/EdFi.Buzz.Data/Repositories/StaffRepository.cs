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
    public class StaffRepository : IStaffRepository
    {
        private readonly BuzzContext _db;

        public StaffRepository(BuzzContext db)
        {
            _db = db;
        }
        public async Task<IReadOnlyList<Staff>> All()
        {
            return await _db.Staffs.OrderBy(x => x.StaffKey).ToListAsync();
        }
        public async Task<Staff> Get(int staffKey)
        {
            return await _db.Staffs.FirstOrDefaultAsync(p => p.StaffKey == staffKey);
        }
    }
}