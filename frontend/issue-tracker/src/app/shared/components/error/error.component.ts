import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorService } from '../../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  error$: Observable<HttpErrorResponse>;

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.error$ = this.errorService.error$();
  }

}
