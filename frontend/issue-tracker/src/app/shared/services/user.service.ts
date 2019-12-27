import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.baseUrl + '/user';

  constructor(private http: HttpClient) { }

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

}
