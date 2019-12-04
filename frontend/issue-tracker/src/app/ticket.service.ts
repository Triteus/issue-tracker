import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ticket } from './models/ticket.model';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';


interface TicketsGroupByStatusRes {
  openTickets: Ticket[];
  activeTickets: Ticket[];
  closedTickets: Ticket[];
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private userMock: User = {
    id: 'userId',
    username: 'Joe Mama',
    firstName: 'Joe',
    lastName: 'Mama',
    email: 'user@mail.com',
    roles: [],
    createdAt: new Date(),
    updatedAt: new Date()

  };

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000/api/ticket/';

  getTickets(params?: object): Observable<{tickets: Ticket[], numAllTickets: number}> {
    console.log('params', params);
    return this.http.get<{tickets: Ticket[], numAllTickets: number}>(this.url, { params: params as any });
  }
/*  */
  getTicketsGroupByStatus(params?: object): Observable<TicketsGroupByStatusRes> {
    console.log('params', params);
    return this.http.get<TicketsGroupByStatusRes>(this.url, { params: {...params as any, groupByStatus: true} });
  }

  getTicket(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(this.url + ticketId);
  }

  postTicket(ticketPayload: Partial<Ticket>): Observable<void> {
    return this.http.post<void>(this.url, ticketPayload)
      .pipe(
        /* catchError(this.handleError<void>('postTicket')) */
      );
  }

  editTicket(payload: any, ticketId: string): Observable<any> {
    return this.http.put<void>(this.url + ticketId, payload);
  }

  deleteTicket(ticketId: string): Observable<Ticket> {
    return this.http.delete<Ticket>(this.url + ticketId);
  }

  editSubTasks(): Observable<void> {
    return of();
  }

}
