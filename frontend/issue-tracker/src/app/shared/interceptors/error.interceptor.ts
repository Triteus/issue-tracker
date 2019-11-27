import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

interface ErrorPayload {
  msg: string;
  param: string;
  value: string;
}


@Injectable()
export class ErrorInterceptor {

  constructor(private snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log('error', err);
        let errMsg = '';

        if (err.message) {
          errMsg = err.message;
        }

        if (err.error.message) {
          errMsg = err.error.message;
        }

        if (err.status === 422) {
          errMsg = err.error.errors.map((errPayload: ErrorPayload) => errPayload.param + ': ' + errPayload.msg).join();
        }

        this.snackBar.open(errMsg, 'OK');
        return throwError(err);
      })
    );
  }
}
