import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { ApiService } from 'src/app/Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

import SocialButton from './SocialButton';
import { Environment } from 'src/app/Models';

export interface LoginComponentProps {
  api: ApiService;
  returnUrl?: string;
  navigate: (command: string) => void;
  googleClientId: string;
}

export const Login: FunctionComponent<LoginComponentProps> = (props: LoginComponentProps) => {

  const model = {
    loggedIn: false,
    user: {} as any
  };
  model.user = null;

  async function onUserAuthState(user) {
    const returnUrl = props.returnUrl || '/';

    if (!user) {
      return;
    }

    model.user = user;
    model.loggedIn = (user != null);

    // Save temp token
    const token = user._token.idToken;
    sessionStorage.setItem('validatingToken', token);

    // authenticationService
    const isUserValid = await props.api.authentication.validateSocialUser(user.email, token);
    sessionStorage.removeItem('validatingToken');
    if (isUserValid) {
      props.navigate(returnUrl);
    }
  }

  const handleSocialLogin = (user) => {
    onUserAuthState(user);
  };

  const handleSocialLoginFailure = (err) => {
    console.log(err.message);
  };

  return (
    <main role='main' className='container h-100'>
      <div className='row justify-content-center h-100'>
        <div className=''>
          <div className='card m-t--50'>
            <div className='card-body'>
              <div className='text-center'>
                <img src='/assets/Owl-Logo-GrandBend.png' style={{ 'width': '100%', 'maxWidth': '350px' }} />

              </div>
              <h1 className=' text-center m-t-25'>Buzz</h1>
              <div className='text-center m-t-20'>
                <SocialButton
                  className='btn btn-primary'
                  provider='google'
                  autoLogin={true}
                  appId={props.googleClientId}
                  onLoginSuccess={handleSocialLogin}
                  onLoginFailure={handleSocialLoginFailure}
                  key={'google'}
                >
                  Login with Google
              </SocialButton>
              </div>
            </div>
            <div className='card-footer d-flex justify-content-between align-items-center'>
              <span className='text-left'>
                <a ui-sref='app.privacypolicy'><i className='icon ion-md-lock'></i> Privacy Policy</a>
              </span>
              <div className='float-right'>0.0.1</div>
            </div>
          </div>
        </div>
      </div>
    </main >

  );
};
