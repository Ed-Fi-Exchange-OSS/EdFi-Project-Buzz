// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.FIF.GraphQL.Helpers;
using GraphQL.Types;
// ReSharper disable InconsistentNaming

namespace EdFi.FIF.GraphQL.Models
{
    public class FIFQuery : ObjectGraphType
    {
        public FIFQuery(ContextServiceLocator contextServiceLocator)
        {
            Field<ListGraphType<StaffType>>(
                "staff",
                resolve: (context) => contextServiceLocator.StaffRepository.All()
            );

            Field<StaffType>(
                "sectionsbystaff",
                arguments: new QueryArguments(new QueryArgument<IntGraphType> { Name = "staffkey" }),
                resolve: (context) => contextServiceLocator.StaffRepository.Get(context.GetArgument<int>("staffkey"))
            );
        }
    }
}