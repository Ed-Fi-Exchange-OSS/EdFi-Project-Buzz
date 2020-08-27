import { AuthenticationContext, AdalConfig } from 'react-adal';
import * as React from 'react';
import { User } from 'src/app/Services/authentication.service';

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

  return <a
    className={props.className}
    onClick={onClickHandler}>
    {props.children}
  </a>;
};

/*
demo account
projectbuzztest@edfidev.onmicrosoft.com
Passw0rd!T3st
34-Date-Demand-Drive-15
*/
