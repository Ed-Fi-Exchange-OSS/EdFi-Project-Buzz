// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using GraphQL.Types;
using GraphQL.Utilities;
using System;
// ReSharper disable InconsistentNaming

namespace EdFi.Buzz.GraphQL.Models
{
    public class BuzzSchema : Schema
    {
        public BuzzSchema(IServiceProvider provider)
            : base(provider)
        {
            Query = provider.GetRequiredService<BuzzQuery>();
        }
    }
}
