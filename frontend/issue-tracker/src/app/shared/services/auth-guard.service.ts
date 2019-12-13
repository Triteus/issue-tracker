import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthGuardService {

  constructor(public auth: AuthService, public router: Router, private snackbar: MatSnackBar) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.auth.logout();
      this.router.navigate(['login']).then(() => {
        this.snackbar.open('Fehler bei Identifizierung des Nutzers. Bitte (erneut) anmelden.', 'OK', {duration: 3000});
      });
      return false;
    }
    return true;
  }
}
