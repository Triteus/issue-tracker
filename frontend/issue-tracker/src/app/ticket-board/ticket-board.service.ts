import { Injectable, OnDestroy } from '@angular/core';
import { Subject, of, Observable, throwError, Subscription } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { TicketStatus } from '../models/ticket.model';
import { environment } from 'src/environments/environment';
import { ProjectTrackerService } from '../shared/services/project-tracker.service';

@Injectable({
  providedIn: 'root'
})
export class TicketBoardService implements OnDestroy {

  selectedProjectId = '';
  sub: Subscription;

  constructor(private http: HttpClient, private projectTrackerService: ProjectTrackerService) {
      this.selectedProjectId = this.projectTrackerService.getSelectedObjectId();
      this.projectTrackerService.selectedObjectId$().subscribe((id) => {
        this.selectedProjectId = id;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get url() {
    return environment.baseUrl + '/v2/project/' + this.selectedProjectId + '/ticket/';
  }

  public changeStatus(status: TicketStatus, ticketId: string): Observable<any> {
    return this.http.patch(this.url + ticketId + '/status', {status});
  }

  public changeTitle(title: string, ticketId: string): Observable<any> {
    return this.http.patch(this.url + ticketId + '/title', {title});
  }

}
