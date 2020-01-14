import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  visitorAccHelpMsg = 'Mit dem Testaccount können alle Daten eingesehen werden. ' +
                      'Jegliche Aktionen wie das Löschen oder Erstellen von Tickets sind deaktiviert.';

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const { email, password } = form.form.value;
    this.login(email, password);
  }

  loginAsVisitor() {
    this.login('randomvisitor@mail.com', 'visitor');
  }

  private login(email: string, password: string) {
    this.authService.login(email, password).subscribe(res => {
      this.snackBar.open('Anmeldung erfolgreich!', 'OK');
      this.router.navigateByUrl('/home');
    });
  }

}
