import { Pipe, PipeTransform } from '@angular/core';
import { TicketStatus } from 'src/app/models/ticket.model';

@Pipe({
  name: 'statusIcon'
})
export class StatusIconPipe implements PipeTransform {

  transform(status: TicketStatus, ...args: any[]): any {
    switch (status) {
      case TicketStatus.OPEN: return 'lock_open';
      case TicketStatus.ACTIVE: return 'access_time';
      case TicketStatus.CLOSED: return 'lock';
      default: return status;
    }
  }

}
