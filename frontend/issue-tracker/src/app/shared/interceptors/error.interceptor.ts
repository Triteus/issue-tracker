import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';

interface ErrorPayload {
  msg: string;
  param: string;
  value: string;
}


@Injectable()
export class ErrorInterceptor {

  constructor(private router: Router, private errorService: ErrorService) { }

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
          errMsg = 'Fehlende Berechtigung!';
        } else if (err.status === 401) {
          // this message is shown when there is no token, token is invalid or expired
          errMsg = 'Nutzer konnte nicht identifiziert werden. Bitte erneut anmelden.';
        }
        return throwError(new Error(errMsg));
      })
    );
  }
}
