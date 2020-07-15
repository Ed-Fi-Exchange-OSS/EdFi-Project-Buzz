// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdFi.Buzz.Core.Data
{
    public interface ISectionRepository
    {
        Task<IReadOnlyList<Section>> All();
        Task<Section> Get(string sectionKey);
        Task<IReadOnlyList<Section>> GetBySectionList(IReadOnlyList<StaffSectionAssociation> staffSectionAssociations);
    }
}