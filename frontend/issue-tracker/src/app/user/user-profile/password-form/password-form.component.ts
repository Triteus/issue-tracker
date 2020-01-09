import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss']
})
export class PasswordFormComponent implements OnInit {

  error: string;
  oldPW = '';
  newPW = '';
  newPWConfirm = '';

  constructor(private authService: AuthService, private snackbar: MatSnackBar) { }

  ngOnInit() {}

  updatePassword(form: NgForm) {
    this.error = '';

    if(this.newPW !== this.newPWConfirm) {
      this.error = 'Passwörter stimmen nicht überein!'
      form.resetForm();
      return;
    }
    const payload = {
      oldPW: this.oldPW,
      newPW: this.newPW,
      newPWConfirm: this.newPWConfirm}
      this.authService.changePassword(payload).subscribe(() => {
        this.snackbar.open('Passwort erfolgreich aktualisiert!', 'OK');
        form.resetForm();
      });
  }
}
