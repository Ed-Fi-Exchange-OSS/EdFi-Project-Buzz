// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.FIF.Core.Models;
using EdFi.FIF.GraphQL.Helpers;
using GraphQL.Types;
// ReSharper disable VirtualMemberCallInConstructor

namespace EdFi.FIF.GraphQL.Models
{
    public class StudentSectionType : ObjectGraphType<StudentSection>
    {
        public StudentSectionType(ContextServiceLocator contextServiceLocator)
        {
            Field("studentsectionkey", x => x.StudentSectionKey);
            Field("studentschoolkey", x => x.StudentSchoolKey);
            Field("studentkey", x => x.StudentKey);
            Field("sectionkey", x => x.SectionKey);
            Field("localcoursecode", x => x.LocalCourseCode);
            Field("subject", x => x.Subject);
            Field("coursetitle", x => x.CourseTitle);
            Field("teachername", x => x.TeacherName);
            Field("studentsectionstartdatekey", x => x.StudentSectionStartDateKey);
            Field("studentsectionenddatekey", x => x.StudentSectionEndDateKey);
            Field("schoolkey", x => x.SchoolKey);
            Field("schoolyear", x => x.SchoolYear);
            Field<StudentSchoolType>("student",
                arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "studentschoolkey" }),
                resolve: context => contextServiceLocator.StudentSchoolRepository.Get(context.Source.StudentSchoolKey), description: "Student");
        }
    }
}
