/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */
import * as React from 'react';
import { FunctionComponent } from 'react';

import SocialButton from './SocialButton';
import { ADFSButton } from './LoginADFS';

import ApiService from '../../Services/ApiService';
import User from '../../Models/User';

export interface LoginComponentProps {
  api: ApiService;
  returnUrl?: string;
  navigate: (url: string) => void;
  googleClientId?: string;
  adfsClientId?: string;
  adfsTenantId?: string;
}

export const Login: FunctionComponent<LoginComponentProps> = (props: LoginComponentProps) => {
  document.title = 'EdFi Buzz: Login';

  const model = {
    loggedIn: false,
    user: {} as any
  };
  model.user = null;

  async function onUserAuthState(user: User) {
    const returnUrl = props.returnUrl || '/';

    if (!user) {
      return;
    }

    // authenticationService
    const isUserValid = await props.api.authentication.validateSocialUser(user.email, user.token, user.tokenProvider);
    if (isUserValid) {
      props.navigate(returnUrl);
    }
  }

  const handleSocialLogin = (user: { email: any; token: { idToken: any } }) => {
    const _user: User = {
      email: user.email,
      token: user.token.idToken,
      tokenProvider: 'react-social-login',
      teacher: null
    };
    onUserAuthState(_user);
  };

  const handleSocialLoginFailure = (err: { message: any }) => {
    console.log(err.message);
  };

  return (
    <main role='main' className='container h-100'>
      <div className='row justify-content-center h-100'>
        <div className=''>
          <div className='card m-t--50'>
            <div className='card-body'>
              <div className='text-center'>
                <img src='/assets/Owl-Logo-GrandBend.png' style={{ 'width': '100%', 'maxWidth': '350px' }} alt="District Logo" />

              </div>
              <h1 className=' text-center m-t-25'>Buzz</h1>
              {/* Boolean(0), Boolean(null), Boolean(undefined) returns false  */
                (Boolean(props.googleClientId)) && <div className='text-center m-t-20'>
                  <SocialButton
                    className='btn btn-primary'
                    provider='google'
                    autoLogin={false}
                    appId={props.googleClientId!}
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                    key={'google'}
                  >
                  Login with Google
                  </SocialButton>
                </div>}
              {(Boolean(props.adfsClientId)) && <div>
                <ADFSButton
                  className='btn btn-primary'
                  clientId={props.adfsClientId!}
                  tenantId={props.adfsTenantId!}
                  onLoggin={(user) => onUserAuthState(user)} >
                    Login with ADFS
                </ADFSButton>
              </div>}
            </div>
            <div className='card-footer d-flex justify-content-between align-items-center'>
              <span className='text-left'>
                <a href='/app.privacypolicy'><i className='icon ion-md-lock'></i> Privacy Policy</a>
              </span>
              <div className='float-right'>0.0.1</div>
            </div>
          </div>
        </div>
      </div>
    </main >

  );
};
