import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})

export class LoginComponent implements OnInit {

  loading = false;
  returnUrl: string;
  error = '';

  public model = {
    loggedIn: false,
    user: {}
  };

  constructor(
    private socialAuthService: AuthService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.model.user = null;
    this.socialAuthService.authState.subscribe((user) => {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

      console.log('trace this');
      console.log(sessionStorage.getItem('currentUser'));
      console.log(user);

      if (!user) {
        return;
      }

      this.model.user = user;
      this.model.loggedIn = (user != null);

      // authenticationService
      if (this.api.authentication.validateSocialUser(user)) {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  signIn(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut(true).then(result => { localStorage.clear(); });
  }

  useMockCredentials() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    const user = {
      provider: 'FixItFrydays',
      id: '1234567890',
      email: 'mockuser@fixitfrydays.com',
      name: 'MockName MockLastName',
      photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRpq-0XdXy8gXKhQ-XCWMNGvnQglIxBJmMWxg',
      firstName: 'MockName',
      lastName: 'MockLastName',
      authToken: '1234567890987654321',
      idToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtb2NrdXNlci5maXhpdGZyeWRheXMuY29tIiwiYXVkIjoiZml4aXRmcnlkYXlzIiwiZW1haWwiOiJtb2NrdXNlckBmaXhpdGZyeWRheXMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJNb2NrTmFtZSBNb2NrTGFzdE5hbWUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9lbmNyeXB0ZWQtdGJuMC5nc3RhdGljLmNvbS9pbWFnZXM_cT10Ym4lM0FBTmQ5R2NScHEtMFhkWHk4Z1hLaFEtWENXTU5Hdm5RZ2xJeEJKbU1XeGciLCJnaXZlbl9uYW1lIjoiTW9ja05hbWUiLCJmYW1pbHlfbmFtZSI6Ik1vY2tMYXN0TmFtZSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTkzNTQ1MTYzLCJleHAiOjI1OTM1NDg3NjMsImp0aSI6ImFhYWFhMGRkMzk0ZTEyOTBkNjhiMTA0YzJmYjE4YjUyMTkxYTcxZmIifQ.vx8CQnuHH_qVIFup37yRRGtp93lFECyr7xKIc5EjEro',
      authorizationCode: ''
    };
    this.api.authentication.validateSocialUser(user);
    this.router.navigate([this.returnUrl]);
  }

}
