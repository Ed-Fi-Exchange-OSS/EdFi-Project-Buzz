import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../Services/authentication.service';
//import { ToastrService } from 'ngx-toastr';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private router: Router/*, private toastr: ToastrService*/) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

      return next.handle(request).pipe(
        catchError(
          (err, caught) => {
            console.log(err);
            if (err.status === 401) {
              this.handleAuthError();
              return of(err);
            }
            throw err;
          }
        )
      );
    }

  private handleAuthError() {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('login');
    //this.toastr.info('Your session has expired.');
  }
}
