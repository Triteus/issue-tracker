import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user$: Observable<User>;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user$ = this.authService.$user();
  }

  updateEmail() {
    
  }

  updateUsername() {

  }

  updatePasswort() {

  }

}
