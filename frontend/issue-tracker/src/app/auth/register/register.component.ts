import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }
  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const payload = form.form.value;
    console.log('form', payload);
    this.sub = this.authService.register(payload).subscribe(res => {
      this.snackBar.open('Nutzer wurde erfolgreich registriert!', 'OK', {
        duration: 3000
      });
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
