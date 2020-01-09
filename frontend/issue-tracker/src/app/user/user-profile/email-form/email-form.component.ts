import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})
export class EmailFormComponent implements OnInit {

  newMail: string;
  newMailConfirm: string;
  error = '';

  @Input() user: User;

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
  }

  updateEmail(form: NgForm) {
    if(this.newMail !== this.newMailConfirm) {
      form.resetForm();
      this.error = 'E-Mail Adressen stimmen nicht überein!';
      return;
    }
    this.userService.changeEmail(this.user.id, this.newMail).subscribe(() => {
      this.authService.refresh().subscribe();
      form.resetForm();
      this.error = '';
    });
  }

}
