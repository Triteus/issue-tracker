import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import decode from 'jwt-decode';

export interface TokenPayload {
  _id: string;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  constructor(public auth: AuthService, public router: Router) {}
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
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
