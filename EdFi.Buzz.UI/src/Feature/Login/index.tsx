/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import mdLock from '@iconify-icons/ion/md-lock';
import Logo from 'assets/Owl-Logo-GrandBend.png';
import ApiService from 'Services/ApiService';
import User from 'Models/User';
import SocialButton from './SocialButton';
import { ADFSButton } from './LoginADFS';

export interface LoginComponentProps {
  api: ApiService;
  returnUrl?: string;
  navigate: (url: string) => void;
  googleClientId?: string;
  adfsClientId?: string;
  adfsTenantId?: string;
  title: string;
  LoginLogo?: string;
  LoginLogoWidth: string;
}

export const Login: FunctionComponent<LoginComponentProps> = (props: LoginComponentProps) => {
  document.title = 'EdFi Buzz: Login';
  const [isUnregisteredUser, setIsUnregisteredUser]=useState(false);
  const UnregistredUser = styled.div`
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
    border-radius: 15px;
    border: 3px solid #ffeeba;
    max-width:350px;
    width:100%;
    display: flex;
    justify-content: center;
  `;
  const BuzzLogo = styled.img`
    width: ${props.LoginLogoWidth};
    max-width: ${props.LoginLogoWidth};
  `;

  async function onUserAuthState(user: User) {
    const returnUrl = props.returnUrl || '/';

    if (!user) {
      return;
    }

    // authenticationService
    const isUserValid = await props.api.authentication.validateSocialUser(user.email, user.token, user.tokenProvider);
    if (isUserValid) {
      props.navigate(returnUrl);
    } else{
      sessionStorage.removeItem('validatingToken');
      setIsUnregisteredUser(true);
    }
  }

  const handleSocialLogin = (user: { email: string; token: { idToken: string } }) => {
    const _user: User = {
      email: user.email,
      token: user.token.idToken,
      tokenProvider: 'react-social-login',
      teacher: null
    };
    onUserAuthState(_user);
  };
  const backToLogin=() => {
    setIsUnregisteredUser(false);
    props.api.authentication.logout();
  };

  const handleSocialLoginFailure = () => {
    // TODO HANDLE ERROR
  };

  return (
    <main role='main' className='container h-100'>
      <div className='row justify-content-center h-100'>
        <div className=''>
          <div className='card m-t--50'>
            <div className='card-body'>
              <div className='text-center'>
                <BuzzLogo src={props.LoginLogo === '' ? Logo : props.LoginLogo} alt="District Logo" />
              </div>
              <h1 className=' text-center m-t-25'>{props.title}</h1>
              {isUnregisteredUser && <div className='text-center m-t-20'>
                <UnregistredUser>
                  <span>
                    <p>The email address you&apos;ve entered does not exist in Buzz.</p>
                    <p>Enter a different account or contact support.</p>
                  </span>
                </UnregistredUser>
                <button className='btn btn-primary' onClick={backToLogin}>Back to Login</button>
              </div>
              }
              {/* Boolean(0), Boolean(null), Boolean(undefined) returns false  */
                (!isUnregisteredUser && Boolean(props.googleClientId)) && <div className='text-center m-t-20'>
                  <SocialButton
                    className='btn btn-primary'
                    provider='google'
                    autoLogin={false}
                    appId={props.googleClientId}
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                    key={'google'}
                  >
                    Login with Google
                  </SocialButton>
                </div>}
              {(!isUnregisteredUser && Boolean(props.adfsClientId)) && <div>
                <ADFSButton
                  className='btn btn-primary'
                  clientId={props.adfsClientId}
                  tenantId={props.adfsTenantId}
                  onLoggin={(user) => onUserAuthState(user)} >
                  Login with ADFS
                </ADFSButton>
              </div>}
            </div>
            <div className='card-footer d-flex justify-content-between align-items-center'>
              <span className='text-left'>
                <a href='/app.privacypolicy'> <Icon icon={mdLock}></Icon> Privacy Policy</a>
              </span>
              <div className='float-right'>0.0.1</div>
            </div>
          </div>
        </div>
      </div>
    </main >

  );
};

