import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ProjectTrackerService } from 'src/app/shared/services/project-tracker.service';
import { TicketTrackerService } from 'src/app/shared/services/ticket-tracker.service';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-sidenav-content',
  templateUrl: './sidenav-content.component.html',
  styleUrls: ['./sidenav-content.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('200ms')
      ]),
      transition(':leave', [
        animate('200ms', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class SidenavContentComponent implements OnInit, OnDestroy {

  projectPath: string;
  ticketPath: string;

  user$: Observable<User>;
  selectedProjectId: string | null;
  selectedProjectName: string;
  selectedTicketId: string | null;
  selectedTicketTitle: string;

  subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private projectTrackerService: ProjectTrackerService,
    private ticketTrackerService: TicketTrackerService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.user$ = this.authService.$user();

    this.selectedProjectId = this.projectTrackerService.getSelectedObjectId();
    this.subs.push(this.projectTrackerService.selectedObjectId$().subscribe((id) => {
      this.selectedProjectId = id;
      if (this.selectedProjectId) {
        this.projectPath = this.router.url.split('/')[3] || 'overview';
      }
    }));

    this.selectedProjectName = this.projectTrackerService.getSelectedObjectName();
    this.subs.push(this.projectTrackerService.selectedObjectName$().subscribe((projectName) => {
      this.selectedProjectName = projectName;
    }));

    this.selectedTicketId = this.ticketTrackerService.getSelectedObjectId();
    this.subs.push(this.ticketTrackerService.selectedObjectId$().subscribe((id) => {
      this.selectedTicketId = id;
      if (this.selectedTicketId) {
        this.ticketPath = this.router.url.split('/')[5] || '';
      }
    }));

    this.selectedTicketTitle = this.ticketTrackerService.getSelectedObjectTitle();
    this.subs.push(this.ticketTrackerService.selectedObjectTitle$().subscribe(ticketTitle => {
      this.selectedTicketTitle = ticketTitle;
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  goToProjectPath(path: string) {
    this.projectPath = path;
    this.router.navigate(['projects', this.selectedProjectId, path]);
  }

  goToTicketPath(path: string) {
    this.ticketPath = path;
    const commands = ['projects', this.selectedProjectId, 'tickets', this.selectedTicketId];
    if (path) {
      commands.push(path);
    }
    this.router.navigate(commands);
  }

}
