import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UserRole } from 'src/app/models/user.model';

interface ErrorPayload {
  msg: string;
  param: string;
  value: string;
}


@Injectable()
export class ErrorInterceptor {

  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router,
    private snackbar: MatSnackBar
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        // update latest error
        this.errorService.updateError(err);

        let errMsg = '';
        if (err.message) {
          errMsg = err.message;
        }
        if (err.error.message) {
          errMsg = err.error.message;
        }

        if (err.status === 422) {
          errMsg = err.error.errors.map((errPayload: ErrorPayload) => errPayload.param + ': ' + errPayload.msg).join();
        } else if (err.status === 403) {
          // user is missing role to access resource
          const user = this.authService.getCurrUser();
          if(user && user.roles && user.roles.includes(UserRole.Visitor)) {
            this.snackbar.open('Fehlende Berechtigung, Testuser hat ausschließlich lesenden Zugriff', 'OK')
          }
          errMsg = 'Fehlende Berechtigung!';
        } else if (err.status === 401) {
          this.authService.logout();
          // this message is shown when there is no token, token is invalid or expired
          errMsg = 'Nutzer konnte nicht identifiziert werden. Bitte (erneut) anmelden.';
          this.router.navigate(['login']);
        }
        return throwError(new Error(errMsg));
      })
    );
  }
}
