import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Teacher } from '../Models';
import { SocialUser } from 'angularx-social-login';
import { TeacherApiService } from './teacher.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private teacherService: TeacherApiService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  validateSocialUser(socialUser: SocialUser): boolean {
    // TODO: Get user profile data from graphql.  Waiting implementation
    let teacher = this.teacherService.getTeacher();
    //if (socialUser.email == "xavier@nearshoredevs.com") {
      let user: User = {
        email: socialUser.email,
        token: socialUser.idToken,
        teacher: teacher
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    //}
    //return false;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

export class User {
  public email: string;
  public token: string;
  public teacher: Teacher
}

