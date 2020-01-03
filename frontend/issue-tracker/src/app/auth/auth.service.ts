import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { take, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import decode from 'jwt-decode';


interface RegisterParams {
  password: string;
  passwordConfirm: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.baseUrl + '/auth/';

  userSubject: BehaviorSubject<User | null>;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.userSubject = new BehaviorSubject<User | null>(null);

    // clear token if it is invalid/expired
    if (!this.isAuthenticated()) {
      this.logout();
      return;
    }

    const user = this.getCurrUser();
    this.userSubject.next(user);
   }

  register(payload: RegisterParams): Observable<any> {
    return this.http.post(this.url + 'register', payload)
      .pipe(take(1));
  }

  login(email: string, password: string) {
    return this.http.post<{token: string}>(this.url + 'login', { email, password })
      .pipe(
        take(1),
        map((payload) => {
          localStorage.setItem('token', payload.token);
          this.userSubject.next(decode<User & {iat: number}>(payload.token));
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  $user() {
    return this.userSubject.asObservable();
  }

  getCurrUser(): User | null {

    const user = this.userSubject.getValue();
    // return from subject if user was already assigned
    if(!!user) {
      return user;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    // decode token to get its payload
    return decode<User & {iat: number}>(token);
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  hasRole(role: UserRole) {
    return this.userSubject.getValue().roles.includes(role);
  }

}
