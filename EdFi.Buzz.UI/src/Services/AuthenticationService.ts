// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { BehaviorSubject, Observable } from 'rxjs';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import jwt from 'jsonwebtoken';
import ApolloHelper from 'Helpers/ApolloHelper';
import JWTHelper from '../Helpers/JWTHelper';
import TeacherApiService from './TeacherService';
import User from '../Models/User';

export default class AuthenticationService {
  public currentUser: Observable<User>;

  readonly storage = window.sessionStorage;

  private currentUserSubject: BehaviorSubject<User>;

  constructor(
    private teacherService: TeacherApiService,
    private apolloClient: ApolloClient<InMemoryCache>
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
        const jwtHelper = new JWTHelper();
        const validateToken = await jwtHelper.validateToken(token);
        if(!validateToken){
          this.cleanUpUser();
          window.location.replace('/login');
          return false;
        }
        const decodedToken = jwt.decode(token, { complete: true, json: true });
        const dateNow = new Date();

        if(decodedToken && decodedToken.payload.exp >= Math.round(dateNow.getTime()/1000)){
          return true;
        }

        this.cleanUpUser();
        window.location.replace('/login');
        return false;

      }
      if(token === ''){
        this.cleanUpUser();
        window.location.replace('/login');
        return false;
      }

      return true;

    } catch{
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
    this.storage.removeItem('currentUser');
    this.storage.removeItem('lastUploadedSurvey');
    localStorage.clear();
    sessionStorage.clear();
    this.currentUserSubject.next(null);
    // clear graphql cache
    ApolloHelper.clearApolloStorage(this.apolloClient);
  };
}



