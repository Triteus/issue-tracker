import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { Ticket, TicketStatus } from '../models/ticket.model';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-ticket-form-dialog',
  templateUrl: './ticket-form-dialog.component.html',
  styleUrls: ['./ticket-form-dialog.component.sass']
})
export class TicketFormDialogComponent implements OnInit {

  ticket$: Observable<Ticket>;
  ticketStatusArr = Object.values(TicketStatus);
  systemsArr = ['JIRA', 'Outlook', 'Confluence'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {ticketId: string}, private ticketService: TicketService) { }



  ngOnInit() {
    this.ticket$ = this.ticketService.getTicket(this.data.ticketId);
  }

}
