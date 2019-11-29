import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material';

export interface TokenPayload {
  _id: string;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  constructor(public auth: AuthService, public router: Router, private snackbar: MatSnackBar) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode<TokenPayload>(token);
    if (
      !this.auth.isAuthenticated() ||
      !tokenPayload.roles.includes(expectedRole)
    ) {

      this.router.navigate(['']).then(() => {
        this.snackbar.open('Seite konnte nicht aufgerufen werden: Fehlende Berechtigung', 'OK', {duration: 3000});
      });
      return false;
    }
    return true;
  }

}
