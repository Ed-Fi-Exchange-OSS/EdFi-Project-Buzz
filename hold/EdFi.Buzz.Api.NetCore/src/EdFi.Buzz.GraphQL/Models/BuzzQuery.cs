// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.GraphQL.Helpers;
using GraphQL.Types;
// ReSharper disable InconsistentNaming

namespace EdFi.Buzz.GraphQL.Models
{
    public class BuzzQuery : ObjectGraphType
    {
        public BuzzQuery(ContextServiceLocator contextServiceLocator)
        {
            Field<ListGraphType<StaffType>>(
                "staff",
                resolve: (context) => contextServiceLocator.StaffRepository.All()
            );

            Field<ListGraphType<StudentSchoolType>>(
                "students",
                resolve: (context) => contextServiceLocator.StudentSchoolRepository.All()
            );

            Field<StudentSchoolType>(
                "student",
                arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "studentschoolkey" }),
                resolve: (context) => contextServiceLocator.StudentSchoolRepository.Get(context.GetArgument<string>("studentschoolkey"))
            );

            Field<StaffType>(
                "sectionsbystaff",
                arguments: new QueryArguments(new QueryArgument<IntGraphType> { Name = "staffkey" }),
                resolve: (context) => contextServiceLocator.StaffRepository.Get(context.GetArgument<int>("staffkey"))
            );

            Field<ListGraphType<StudentSectionType>>(
                "studentsbysection",
                arguments: new QueryArguments(new QueryArgument<StringGraphType> {Name = "sectionkey"}),
                resolve: (context) =>
                    contextServiceLocator.StudentSectionRepository.GetBySection(
                        context.GetArgument<string>("sectionkey"))
            );
        }
    }
}
