import { Component, OnInit, Input } from '@angular/core';
import { TicketStatus } from 'src/app/models/ticket.model';

@Component({
  selector: 'app-status-icon',
  templateUrl: './status-icon.component.html',
  styleUrls: ['./status-icon.component.scss']
})
export class StatusIconComponent implements OnInit {

  @Input() status: TicketStatus;

  constructor() { }

  ngOnInit() {
  }

}
