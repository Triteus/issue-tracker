import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { take, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

interface RegisterParams {
  password: string;
  passwordConfirm: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {

  url = environment.baseUrl + '/auth/';

  user: User | null = null;
  token: string | null = null;

  userSubject: BehaviorSubject<User | null>;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    const user = localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<User | null>(user ? JSON.parse(user) : null);
   }

  register(payload: RegisterParams): Observable<any> {
    return this.http.post(this.url + 'register', payload)
      .pipe(take(1));
  }

  login(email: string, password: string) {
    return this.http.post(this.url + 'login', { email, password })
      .pipe(
        take(1),
        map((payload: any) => {
          this.user = payload.user;
          this.token = payload.token;
          localStorage.setItem('token', payload.token);
          localStorage.setItem('user', JSON.stringify(payload.user));
          this.userSubject.next(payload.user);
        })
      );
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  $user() {
    return this.userSubject.asObservable();
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }


}
