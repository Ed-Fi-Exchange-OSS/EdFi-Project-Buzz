// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { BehaviorSubject, Observable } from 'rxjs';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import jwt from 'jsonwebtoken';
import ApolloHelper from 'Helpers/ApolloHelper';
import { OAuth2Client } from 'google-auth-library';
import JWTHelper from 'Helpers/JWTHelper';
import TeacherApiService from './TeacherService';
import User from '../Models/User';
import EnvironmentService from './EnvironmentService';

export default class AuthenticationService {
  public currentUser: Observable<User>;

  readonly storage = window.sessionStorage;

  private currentUserSubject: BehaviorSubject<User>;

  constructor(
    private teacherService: TeacherApiService,
    private apolloClient: ApolloClient<InMemoryCache>,
    private environmentService: EnvironmentService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.storage.getItem('currentUser') ));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    this.validateJWT();
    return this.currentUserSubject.value;
  }

  async validateSocialUser(email: string, idToken: string, tokenProvider: string): Promise<boolean> {
    // Save temp token
    sessionStorage.setItem('validatingToken', idToken);
    // TODO: Get user profile data from graphql.  Waiting implementation
    const teacher = await this.teacherService.getTeacher();
    if (!teacher) {
      console.error('Staff not found');
      return false;
    }

    const user: User = {
      email,
      token: idToken,
      tokenProvider,
      teacher
    };
    ApolloHelper.clearApolloStorage(this.apolloClient);
    this.storage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return true;
  }


  async validateToken (token: string): Promise<boolean> {
    try {
      let ticket;
      if (this.environmentService.environment.ADFS_TENANT_ID !== '') {
        const jwtHelper = new JWTHelper();
        ticket = jwtHelper.validateToken(token);
        const decodedToken = jwt.decode(token, { complete: true, json: true });
        const dateNow = new Date();

        if(decodedToken && decodedToken.payload.exp >= Math.round(dateNow.getTime()/1000)){
          return true;
        }
        return true;
      }
      const client = new OAuth2Client(
        this.environmentService.environment.GOOGLE_CLIENT_ID
      );
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: this.environmentService.environment.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      return payload.email_verified;

    } catch (error) {
      console.error(error);
      return false;
    }
  };

  public validateJWT = async (): Promise<boolean> =>{
    const token = sessionStorage.getItem('validatingToken');
    try {
      if(token){
        const validateToken = await this.validateToken(token);
        if(!validateToken){
          throw new Error('Did not return a valid token');
        }
        return true;
      }
      return false;
    } catch(err) {
      console.error(`validateJWT error: ${err.message} - ${err.detail}`);
      this.cleanUpUser();
      window.location.replace('/login');
      return false;
    }
  };

  cleanUpUser = (): void =>{
    this.storage.removeItem('currentUser');
    this.storage.removeItem('lastUploadedSurvey');
    localStorage.clear();
    sessionStorage.clear();
  };

  logout = (): void => {
    // remove user from local storage to log user out
    this.cleanUpUser();
    this.currentUserSubject.next(null);
    // clear graphql cache
    ApolloHelper.clearApolloStorage(this.apolloClient);
  };
}



