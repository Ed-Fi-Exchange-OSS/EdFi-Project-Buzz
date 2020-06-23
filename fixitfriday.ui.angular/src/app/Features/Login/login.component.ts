import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, GoogleLoginProvider } from "angularx-social-login";

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
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.model.user = null;

    this.socialAuthService.authState.subscribe((user) => {

      console.log("trace this");
      console.log(localStorage.getItem('currentUser'));
      console.log(user);

      if (!user)
        return;

      this.model.user = user;
      this.model.loggedIn = (user != null);

      //authenticationService
      this.goToLanding();
    });
  }

  signIn(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut(true).then(result => { localStorage.clear(); });
  }

  goToLanding() {
    this.router.navigate(['/app']);
  }

}
