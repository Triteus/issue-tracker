import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }
  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const payload = form.form.value;
    console.log('form', payload);
    if (payload.password !== payload.passwordConfirm) {
      this.snackBar.open('Passwörter stimmen nicht überein!', 'OK', {duration: 3000});
      form.
      form.reset({...form.form.value, password: '', passwordConfirm: ''});
      return;
    }

    this.sub = this.authService.register(payload).subscribe(res => {
      this.snackBar.open('Nutzer wurde erfolgreich registriert!', 'OK', {
        duration: 3000
      });
      this.router.navigateByUrl('/login');
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
