// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { BehaviorSubject, Observable } from 'rxjs';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import ApolloHelper from 'Helpers/ApolloHelper';
import { validateToken } from 'Helpers/JWTHelper';
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

  public validateJWT = async (): Promise<boolean> =>{
    const token = sessionStorage.getItem('validatingToken');
    try {
      if(token){
        const isValid = await validateToken(token, this.environmentService.environment);
        if(!isValid){
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



