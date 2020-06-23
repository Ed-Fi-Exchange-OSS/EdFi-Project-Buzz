// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.FIF.Core.Models;
using EdFi.FIF.GraphQL.Helpers;
using GraphQL.Types;

namespace EdFi.FIF.GraphQL.Models
{
    public class StudentContactType : ObjectGraphType<StudentContact>
    {
        public StudentContactType(ContextServiceLocator contextServiceLocator)
        {
        }
    }
}