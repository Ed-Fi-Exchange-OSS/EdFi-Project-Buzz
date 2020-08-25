// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Teacher } from 'src/app/Models/teacher';
import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';
import { AdalLogOut } from '../LoginReact/loginADFS';
import { EnvironmentService } from 'src/app/Services/environment.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  teacher: Teacher;

  constructor(private api: ApiService
    , private socialAuthService: AuthService
    , private router: Router
    , private environmentService: EnvironmentService) {
    const user = api.authentication.currentUserValue;
    this.teacher = user.teacher;
  }


  signOut() {
    /* Boolean(0), Boolean(null), Boolean(undefined) returns false  */
    if (Boolean(this.environmentService.environment.GOOGLE_CLIENT_ID)) {
      this.socialAuthService
        .signOut(true)
        .then(result => {
          this.api.authentication.logout();
          /* Console.log needed to be abloe to logout, possible because this uses
          angularx-social-login and we logged in with react-social-login */
          console.log('Logging out');
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.error(error);
          this.router.navigate(['/login']);
        });
    }

    if (Boolean(this.environmentService.environment.ADFS_CLIENT_ID)) {
      AdalLogOut(
        this.environmentService.environment.ADFS_CLIENT_ID,
        this.environmentService.environment.ADFS_TENANT_ID);
      this.api.authentication.logout();
    }
  }

}
