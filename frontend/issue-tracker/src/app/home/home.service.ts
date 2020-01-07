import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { map } from 'rxjs/operators';
import { Ticket } from '../models/ticket.model';

export interface HomeStatsPayload {
  numProjects: number;
  numTickets: number;
  numUsers: number;
  numTicketsCreatedLastWeek: number;
  numTicketsCreatedLastMonth: number;
}

export type TicketWithProjectId = Ticket & {projectId: string}


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  url = environment.baseUrl + '/v2/home';

  constructor(private http: HttpClient) { }

  getHomeStats(): Observable<HomeStatsPayload> {
    return this.http.get<HomeStatsPayload>(this.url);
  }

  getAssignedProjects(): Observable<Project[]> {
    return this.http.get<{projects: Project[]}>(this.url + '/assigned-projects')
    .pipe(
      map(res => res.projects)
    )
  }

  getLastTickets(): Observable<TicketWithProjectId[]> {
    return this.http.get<{tickets: TicketWithProjectId[]}>(this.url + '/last-tickets')
    .pipe(
      map(res => res.tickets)
    )
  }




}
