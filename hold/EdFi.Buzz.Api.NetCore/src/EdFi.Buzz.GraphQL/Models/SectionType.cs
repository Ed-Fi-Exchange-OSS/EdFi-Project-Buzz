// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using EdFi.Buzz.Core.Models;
using EdFi.Buzz.GraphQL.Helpers;
using GraphQL.Types;
// ReSharper disable VirtualMemberCallInConstructor

namespace EdFi.Buzz.GraphQL.Models
{
    public class SectionType : ObjectGraphType<Section>
    {
        public SectionType(ContextServiceLocator contextServiceLocator)
        {
            Field("sectionkey", x => x.SectionKey);
            Field("schoolkey", x => x.SchoolKey);
            Field("localcoursecode", x => x.LocalCourseCode);
            Field("sessionname", x => x.SessionName);
            Field("sectionidentifier", x => x.SectionIdentifier);
            Field("schoolyear", x => x.SchoolYear);
        }
    }
}