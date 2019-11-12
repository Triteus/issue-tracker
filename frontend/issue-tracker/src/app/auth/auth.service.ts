import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { take, map, tap } from 'rxjs/operators';


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

  url = 'http://localhost:3000/api/auth/';

  user: User | null = null;
  token: string | null = null;

  userSubject: BehaviorSubject<User | null>;

  constructor(private http: HttpClient) {
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


}
