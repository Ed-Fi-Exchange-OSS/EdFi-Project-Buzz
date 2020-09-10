/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { AuthenticationContext, AdalConfig } from 'react-adal';

import User from '../../Models/User';

export function getAdalConfig(clientId: string, tenantId: string): AdalConfig {
  return {
    clientId: clientId,
    tenant: tenantId,
    popUp: true,
    endpoints: {
      api: clientId
    },
  };
}


export function AdalLogOut(clientId: string, tenantId: string) {
  const adalConfig = getAdalConfig(clientId, tenantId);
  const authContext = new AuthenticationContext(adalConfig);
  const cUser = authContext.getCachedUser();
  if (cUser) {
    authContext.logOut();
    authContext.clearCache();
  }
}

export interface ADFSComponentProps {
  clientId: string;
  tenantId: string;
  className: string;
  children: any;
  onLoggin?: (user: any) => void;
}


export const ADFSButton: React.FunctionComponent<ADFSComponentProps> = (props: ADFSComponentProps) => {
  const adalConfig = getAdalConfig(props.clientId, props.tenantId);
  adalConfig.callback = tokenCallback;
  const authContext = new AuthenticationContext(adalConfig);
  const token = authContext.getCachedToken(adalConfig.endpoints.api);
  if (token) {
    tokenCallback(null, token, null);
  }

  function tokenCallback(errorDesc: string | null, tokenId: string | null, error: any) {
    if (!tokenId) {
      return;
    }
    const profile = authContext.getCachedUser();
    const user: User = {
      email: profile.userName,
      tokenProvider: 'react-adal',
      token: tokenId,
      teacher: null
    };
    if (props.onLoggin) { props.onLoggin(user); }
  }

  function onClickHandler(event) {
    authContext.login();
  }

  return <button
    className={props.className}
    onClick={onClickHandler}>
    {props.children}
  </button>;
};

/*
demo account
projectbuzztest@edfidev.onmicrosoft.com
Passw0rd!T3st
34-Date-Demand-Drive-15
*/
