import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.baseUrl + '/user';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUsers(filterStr = ''): Observable<User[]> {
    return this.http.get<User[]>(this.url)
    .pipe(
      map(users => {
        return users.filter(u => u.username.toLowerCase().includes(filterStr.toLowerCase().trim()));
      })
    );
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(this.url + '/' + userId);
  }

  changeEmail(userId: string, email: string) {
    return this.http.patch<{message: string, updatedUser: User}>(`${this.url}/${userId}`, {email});
  }

  changeUsername(userId: string, firstName: string, lastName: string) {
    return this.http.patch<{message: string, updatedUser: User}>(`${this.url}/${userId}`, {firstName, lastName});
  }

}
