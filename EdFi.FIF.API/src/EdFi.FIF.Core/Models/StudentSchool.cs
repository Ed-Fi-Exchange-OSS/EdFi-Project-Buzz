// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace EdFi.FIF.Core.Models
{
    public class StudentSchool
    {
        public string StudentSchoolKey { get; set; }
        public string StudentKey { get; set; }
        public string SchoolKey { get; set; }
        public string SchoolYear { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentMiddleName { get; set; }
        public string StudentLastName { get; set; }
        public string EnrollmentDateKey { get; set; }
        public string GradeLevel { get; set; }
        public string LimitedEnglishProficiency { get; set; }
        public bool IsHispanic { get; set; }
        public string Sex { get; set; }
    }
}