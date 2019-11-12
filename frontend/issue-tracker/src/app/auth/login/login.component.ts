import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const {email, password} = form.form.value;
    console.log('form', form.form);
    this.authService.login(email, password).subscribe(res => {
      this.snackBar.open('Anmeldung erfolgreich!', 'OK');
      this.router.navigateByUrl('/overview');
    });
  }

}
