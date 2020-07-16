// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Teacher } from 'src/app/Models/teacher';
import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent {
  teacher: Teacher;

  constructor(private api: ApiService
    , private socialAuthService: AuthService
    , private router: Router) {
    const user = api.authentication.currentUserValue;
    this.teacher = user.teacher;
  }


  signOut() {
    this.api.authentication.logout();
    this.socialAuthService
      .signOut(true)
      .then(result => { localStorage.clear(); this.router.navigate(['/login']); })
      .catch(() => this.router.navigate(['/login']));
  }

}
