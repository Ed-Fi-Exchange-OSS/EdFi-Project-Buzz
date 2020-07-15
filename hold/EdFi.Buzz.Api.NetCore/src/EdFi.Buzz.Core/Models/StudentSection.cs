// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace EdFi.Buzz.Core.Models
{
    public class StudentSection
    {
        public string StudentSectionKey { get; set; }
        public string StudentSchoolKey { get; set; }
        public string StudentKey { get; set; }
        public string SectionKey { get; set; }
        public string LocalCourseCode { get; set; }
        public string Subject { get; set; }
        public string CourseTitle { get; set; }
        public string TeacherName { get; set; }
        public string StudentSectionStartDateKey { get; set; }
        public string StudentSectionEndDateKey { get; set; }
        public string SchoolKey { get; set; }
        public string SchoolYear { get; set; }
    }
}