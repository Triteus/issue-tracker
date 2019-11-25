import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ticket, Priority, TicketStatus } from './models/ticket.model';
import { HttpClient } from '@angular/common/http';
import { catchError, delay } from 'rxjs/operators';
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

  private ticketsMock: Ticket[] = [
    {
      id: 'id',
      owner: this.userMock,
      lastEditor: this.userMock,
      editors: [],
      assignedTo: this.userMock,
      priority: Priority.HIGH,
      neededAt: new Date(),
      title: 'title',
      description: 'description',
      status: TicketStatus.OPEN,
      subTasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      affectedSystems: ['JIRA']
    },
    {
      id: 'id2',
      owner: this.userMock,
      lastEditor: this.userMock,
      editors: [],
      assignedTo: this.userMock,
      priority: Priority.HIGH,
      neededAt: new Date(),
      title: 'title2',
      description: 'description2',
      status: TicketStatus.OPEN,
      subTasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      affectedSystems: ['OUTLOOK', 'WINDOWS']
    },
  ];

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000/api/ticket/';

  getTickets(params?: object): Observable<{tickets: Ticket[], numAllTickets: number}> {
    console.log('params', params);
    return this.http.get<{tickets: Ticket[], numAllTickets: number}>(this.url, { params: params as any })
      .pipe(
        catchError(this.handleError<{tickets: Ticket[], numAllTickets: number}>('getTickets', {tickets: [], numAllTickets: 0}))
      );
  }

  getTicketsGroupByStatus(params?: object): Observable<TicketsGroupByStatusRes> {
    console.log('params', params);
    return this.http.get<TicketsGroupByStatusRes>(this.url, { params: {...params as any, groupByStatus: true} })
      .pipe(
        catchError(this.handleError<TicketsGroupByStatusRes>('getTicketsGroupByStatus'))
      );
  }

  getTicket(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(this.url + ticketId)
      .pipe(
        catchError(this.handleError<Ticket>('getTicket'))
      );
  }

  postTicket(ticketPayload: Partial<Ticket>): Observable<void> {
    return this.http.post<void>(this.url, ticketPayload)
      .pipe(
        catchError(this.handleError<void>('postTicket'))
      );
  }

  editTicket(payload: any, ticketId: string): Observable<any> {
    return this.http.put<void>(this.url + ticketId, payload)
      .pipe(
        catchError(this.handleError<void>('editTicket'))
      );
  }

  deleteTicket(ticketId: string): Observable<Ticket> {
    return this.http.delete<Ticket>(this.url + ticketId)
      .pipe(
        catchError(this.handleError<Ticket>('deleteTicket'))
      );
  }

  editSubTasks(): Observable<void> {
    return of();
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
