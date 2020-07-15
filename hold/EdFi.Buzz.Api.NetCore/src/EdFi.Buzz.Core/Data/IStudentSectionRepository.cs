// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdFi.Buzz.Core.Data
{
    public interface IStudentSectionRepository
    {
        Task<IReadOnlyList<StudentSection>> All();
        Task<StudentSection> Get(string studentSectionKey);
        Task<IReadOnlyList<StudentSection>> GetByStudent(string studentKey);
        Task<IReadOnlyList<StudentSection>> GetBySection(string sectionKey);
    }
}
