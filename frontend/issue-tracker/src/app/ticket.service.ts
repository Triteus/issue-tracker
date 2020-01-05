import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription, merge } from 'rxjs';
import { Ticket } from './models/ticket.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ProjectTrackerService } from './shared/services/project-tracker.service';
import { AuthService } from './auth/auth.service';


interface TicketsGroupByStatusRes {
  openTickets: Ticket[];
  activeTickets: Ticket[];
  closedTickets: Ticket[];
}


// TODO At the moment, project-id is taken from current route and used for every route.
// Since ticket-ids are already unique, we should not need to provide
// a project-id all the time. This has to be adjusted on the backend.

@Injectable({
  providedIn: 'root'
})
export class TicketService implements OnDestroy {

  selectedProjectId = '';

  sub: Subscription;
  paramMaps = [];


  constructor(
    private http: HttpClient,
    private projectTrackerService: ProjectTrackerService,
    private authService: AuthService
  ) { }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get url() {
    return environment.baseUrl + '/v2/project/' + this.projectTrackerService.getSelectedObjectId() + '/ticket/';
  }

  getTickets(params?: object): Observable<{ tickets: Ticket[], numAllTickets: number }> {
    return this.http.get<{ tickets: Ticket[], numAllTickets: number }>(this.url, { params: params as any });
  }

  getCurrUserTickets(params?: object) {
    const id = this.authService.getCurrUser().id;
    return this.getTickets({...params, userId: id})
    .pipe(
      map((res) => {
        return res.tickets;
      })
    );
  }

  getTicketsGroupByStatus(params?: object): Observable<TicketsGroupByStatusRes> {
    return this.http.get<TicketsGroupByStatusRes>(this.url, { params: { ...params as any, groupByStatus: true } });
  }

  getTicket(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(this.url + ticketId);
  }

  getTicketTitle(ticketId: string): Observable<string> {
    return this.http.get<{ title: string }>(this.url + ticketId + '/title')
      .pipe(
        map(res => res.title)
      );
  }

  postTicket(ticketPayload: Partial<Ticket>): Observable<void> {
    return this.http.post<void>(this.url, ticketPayload);
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
