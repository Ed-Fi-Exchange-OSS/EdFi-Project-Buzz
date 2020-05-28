// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace EdFi.FIF.Core.Models
{
    public class Section
    {
        public string SectionKey { get; set; }
        public string SchoolKey { get; set; }
        public string LocalCourseCode { get; set; }
        public string SessionName { get; set; }
        public string SectionIdentifier { get; set; }
        public short SchoolYear { get; set; }
    }
}