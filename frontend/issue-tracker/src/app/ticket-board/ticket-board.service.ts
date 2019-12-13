import { Injectable } from '@angular/core';
import { Subject, of, Observable, throwError } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import { TicketService } from '../ticket.service';
import { TicketStatus } from '../models/ticket.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketBoardService {

  url = environment.baseUrl + '/ticket/';

  constructor(private http: HttpClient) { }

  public changeStatus(status: TicketStatus, ticketId: string): Observable<any> {
    return this.http.patch(this.url + ticketId + '/status', {status})
  }

  public changeTitle(title: string, ticketId: string): Observable<any> {
    return this.http.patch(this.url + ticketId + '/title', {title});
  }

}
