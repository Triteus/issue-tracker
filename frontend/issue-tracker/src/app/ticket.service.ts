import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription, merge } from 'rxjs';
import { Ticket } from './models/ticket.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ParamTrackerService } from './param-tracker.service';


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
    private paramTrackerService: ParamTrackerService
  ) {
    this.selectedProjectId = this.paramTrackerService.getParam('projectId');
    this.paramTrackerService.param$('projectId').subscribe((id) => {
      this.selectedProjectId = id;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get url() {
    return environment.baseUrl + '/v2/project/' + this.selectedProjectId + '/ticket/';
  }

  getTickets(params?: object): Observable<{ tickets: Ticket[], numAllTickets: number }> {
    console.log('params', params);
    return this.http.get<{ tickets: Ticket[], numAllTickets: number }>(this.url, { params: params as any });
  }

  getTicketsGroupByStatus(params?: object): Observable<TicketsGroupByStatusRes> {
    console.log('params', params);
    return this.http.get<TicketsGroupByStatusRes>(this.url, { params: { ...params as any, groupByStatus: true } });
  }

  getTicket(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(this.url + ticketId);
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
