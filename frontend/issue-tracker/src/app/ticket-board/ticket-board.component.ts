import { Component, OnInit, OnDestroy } from '@angular/core';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Observable, Subscription, observable, of } from 'rxjs';
import { Ticket, TicketStatus } from '../models/ticket.model';
import { TicketService } from '../ticket.service';
import { TicketBoardService } from './ticket-board.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMapTo, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-board',
  templateUrl: './ticket-board.component.html',
  styleUrls: ['./ticket-board.component.scss']
})
export class TicketBoardComponent implements OnInit, OnDestroy {

  tickets$: Observable<Ticket[]>;
  openTickets: Ticket[] = [];
  closedTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];

  dragDisabled = true;

  fetchSub: Subscription;
  querySub: Subscription;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadTickets();

    this.querySub = this.route.queryParamMap.subscribe((queryParamMap) => {
      // user deleted or updated ticket in dialog-component
      if (queryParamMap.get('reset')) {
        this.router.navigateByUrl('ticket-board')
          .then(() => this.loadTickets());
      }
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
    this.fetchSub.unsubscribe();
  }

  private loadTickets() {
    this.openTickets = [];
    this.inProgressTickets = [];
    this.closedTickets = [];

    this.fetchSub = of([]).pipe(switchMap((res) => {
      return this.ticketService.getTicketsGroupByStatus();
    }))
    .subscribe(ticketsByStatus => {
      this.dragDisabled = false;
      this.openTickets = ticketsByStatus.openTickets;
      this.inProgressTickets = ticketsByStatus.activeTickets;
      this.closedTickets = ticketsByStatus.closedTickets;
    });
  }

  setDragDisabled(val: boolean) {
    this.dragDisabled = val;
  }
}
