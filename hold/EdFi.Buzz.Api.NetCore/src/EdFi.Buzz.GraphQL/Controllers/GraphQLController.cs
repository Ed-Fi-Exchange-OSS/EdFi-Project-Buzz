// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EdFi.Buzz.GraphQL.Models;
using GraphQL;
using GraphQL.Types;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Cors;
// ReSharper disable InconsistentNaming

namespace EdFi.Buzz.GraphQL.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowPWAOrigin")]
    public class GraphQLController : ControllerBase
    {
        private readonly IDocumentExecuter _documentExecuter;
        private readonly ISchema _schema;

        public GraphQLController(ISchema schema, IDocumentExecuter documentExecuter)
        {
            _schema = schema;
            _documentExecuter = documentExecuter;
        }

        //private readonly ILogger<GraphQLController> _logger;

        /*public GraphQLController(ILogger<GraphQLController> logger)
        {
            _logger = logger;
        }*/

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] GraphQLQuery query)
        {
            if (query == null) { throw new ArgumentNullException(nameof(query)); }
            var inputs = query.Variables.ToInputs();
            var executionOptions = new ExecutionOptions
            {
                Schema = _schema,
                Query = query.Query,
                Inputs = inputs
            };

            var watch = Stopwatch.StartNew();

            var result = await _documentExecuter.ExecuteAsync(executionOptions).ConfigureAwait(false);

            var objectResult = Write(result);

            watch.Stop();

            //log.Info($"{Environment.NewLine}{query.Query.ToString()}{Environment.NewLine} executed in {watch.ElapsedMilliseconds} ms");

            return Ok(objectResult);
        }
        private string Write(ExecutionResult result)
        {
            return JsonConvert.SerializeObject(
                result,
                Formatting.Indented,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });
        }
    }
}
