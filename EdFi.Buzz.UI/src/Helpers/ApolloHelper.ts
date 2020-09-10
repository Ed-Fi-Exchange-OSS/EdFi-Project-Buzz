// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApolloClient, InMemoryCache } from '@apollo/client';

export default class ApolloHelper {

  static clearApolloStorage = (client: ApolloClient<InMemoryCache>): void => {
    client.resetStore();
    client.clearStore();
  };
}
