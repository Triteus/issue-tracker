import { Component, OnInit } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { Observable } from 'rxjs';
import { ProjectService } from '../project/project.service';
import { HomeService, HomeStatsPayload, TicketWithProjectId } from './home.service';
import { Project } from '../models/project.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homeStats$: Observable<HomeStatsPayload>;
  lastTickets$: Observable<TicketWithProjectId[]>;
  assignedProjects$: Observable<Project[]>;

  constructor(private homeService: HomeService, private router: Router) { }

  ngOnInit() {
    this.homeStats$ = this.homeService.getHomeStats();
    this.lastTickets$ = this.homeService.getLastTickets();
    this.assignedProjects$ = this.homeService.getAssignedProjects();
  }

  openTicket(projectId: string, ticketId: string) {
    this.router.navigate(['projects', projectId, 'tickets', ticketId ]);
  }

  openProject(projectId: string) {
    this.router.navigate(['projects', projectId]);
  }

}
