// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Teacher } from '../Models';
import { TeacherApiService } from './teacher.service';
import { Apollo } from 'apollo-angular';
import { ApolloHelper } from '../Helpers/apollo.helper';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  readonly storage = window.sessionStorage;

  constructor(
    private teacherService: TeacherApiService,
    private apollo: Apollo
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.storage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  async validateSocialUser(email: string, idToken: string, tokenProvider: string): Promise<boolean> {
    // Save temp token
    sessionStorage.setItem('validatingToken', idToken);
    // TODO: Get user profile data from graphql.  Waiting implementation
    const teacher = await this.teacherService.getTeacher();
    sessionStorage.removeItem('validatingToken');
    if (!teacher) {
      console.error('Staff not found');
      return false;
    }

    const user: User = {
      email: email,
      token: idToken,
      tokenProvider: tokenProvider,
      teacher: teacher
    };
    ApolloHelper.clearApolloStorage(this.apollo.getClient());
    this.storage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return true;
  }

  logout() {
    // remove user from local storage to log user out
    this.storage.removeItem('currentUser');
    this.storage.removeItem('lastUploadedSurvey');
    localStorage.clear();
    sessionStorage.clear();
    this.currentUserSubject.next(null);
    // clear graphql cache
    ApolloHelper.clearApolloStorage(this.apollo.getClient());
  }

}

export class User {
  public email: string;
  public token: string;
  public tokenProvider: string;
  public teacher: Teacher;
}

