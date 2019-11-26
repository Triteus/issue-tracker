import { Component, OnInit } from '@angular/core';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Observable, Subscription } from 'rxjs';
import { Ticket, TicketStatus } from '../models/ticket.model';
import { TicketService } from '../ticket.service';
import { TicketBoardService } from './ticket-board.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ticket-board',
  templateUrl: './ticket-board.component.html',
  styleUrls: ['./ticket-board.component.scss']
})
export class TicketBoardComponent implements OnInit {

  tickets$: Observable<Ticket[]>;
  openTickets: Ticket[] = [];
  closedTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];

  dragDisabled = true;

  querySub: Subscription;

  constructor(
    private ticketService: TicketService,
    private ticketBoardService: TicketBoardService,
    private snackBar: MatSnackBar,
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

  private loadTickets() {
    this.openTickets = [];
    this.inProgressTickets = [];
    this.closedTickets = [];

    this.ticketService.getTicketsGroupByStatus()
    .subscribe(ticketsByStatus => {
      this.dragDisabled = false;
      this.openTickets = ticketsByStatus.openTickets;
      this.inProgressTickets = ticketsByStatus.activeTickets;
      this.closedTickets = ticketsByStatus.closedTickets;
    });
  }

  drop(event: CdkDragDrop<Ticket[]>) {

    const { previousContainer, container, previousIndex, currentIndex } = event;
    if (previousContainer === container) {
      moveItemInArray(container.data, previousIndex, currentIndex);
      // TODO locally save position of item within list
    } else {
      const ticketId = previousContainer.data[previousIndex].id;
      console.log('ticket-id', ticketId);
      transferArrayItem(previousContainer.data,
        container.data,
        previousIndex,
        currentIndex);

      this.dragDisabled = true;
      // status can be grabbed from HTML-element as data-attribute
      const status = container.element.nativeElement.dataset.status as TicketStatus;
      this.ticketBoardService.changeStatus(status, ticketId)
        .subscribe(
          res => {
            this.dragDisabled = false;
          },
          err => {
            // move item back
            transferArrayItem(container.data,
              previousContainer.data,
              currentIndex,
              previousIndex);

            this.dragDisabled = false;
            this.snackBar.open('Status konnte nicht aktualisiert werden!', 'OK', { duration: 3000 });
          });
    }
  }
}
