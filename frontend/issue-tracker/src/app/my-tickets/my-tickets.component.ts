import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/ticket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SortParams } from '../ticket-table/issue-table.component';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.scss']
})
export class MyTicketsComponent implements OnInit {

  ownerTickets$: Observable<Ticket[]>;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute
    ) { }
  displayedColumns: string[] = ['title', 'category', 'status', 'updatedAt'];

  ngOnInit() {
    const params: SortParams = {
      sortBy: 'updatedAt',
      sortDir: 'desc'
    }
    this.ownerTickets$ = this.ticketService.getCurrUserTickets(params);
  }

  openDialog(ticketId: string) {
    this.router.navigate(['../', 'tickets', ticketId], { relativeTo: this.route });
  }

}
