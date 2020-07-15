// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.Core.Models;
using EdFi.Buzz.GraphQL.Helpers;
using GraphQL.Types;

namespace EdFi.Buzz.GraphQL.Models
{
    public class StaffSectionAssociationType : ObjectGraphType<StaffSectionAssociation>
    {
        public StaffSectionAssociationType(ContextServiceLocator contextServiceLocator)
        {
            Field<SectionType>("section",
                arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "sectionkey" }),
                resolve: context => contextServiceLocator.SectionRepository.Get(context.Source.SectionKey), description: "Section");
        }
    }
}