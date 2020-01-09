import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-username-form',
  templateUrl: './username-form.component.html',
  styleUrls: ['./username-form.component.scss']
})
export class UsernameFormComponent implements OnInit {

  @Input() user: User;

  firstName = '';
  lastName = '';

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
  }

  updateUsername(form: NgForm) {
    this.userService.changeUsername(this.user.id, this.firstName, this.lastName).subscribe(() => {
      this.authService.refresh().subscribe();
      form.resetForm();
    });
  }

}
