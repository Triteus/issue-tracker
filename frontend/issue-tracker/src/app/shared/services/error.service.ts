import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


/**
 * Service that holds latest HttpErrorResponse.
 */


@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);

  updateError(err: HttpErrorResponse) {
    this.errorSubject.next(err);
  }

  error$() {
    return this.errorSubject.asObservable();
  }


}
