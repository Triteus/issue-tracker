import { Pipe, PipeTransform } from '@angular/core';
import { TicketStatus } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/ticket.service';

@Pipe({
  name: 'statusName'
})
export class StatusPipe implements PipeTransform {

  transform(status: TicketStatus, ...args: any[]): any {
    switch (status) {
      case TicketStatus.OPEN: return 'Offen';
      case TicketStatus.CLOSED: return 'Erledigt';
      case TicketStatus.ACTIVE: return 'In Arbeit';
      default: return status;
    }
  }
}
