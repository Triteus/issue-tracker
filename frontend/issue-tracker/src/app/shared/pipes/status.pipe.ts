import { Pipe, PipeTransform } from '@angular/core';
import { TicketStatus } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/ticket.service';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value === TicketStatus.OPEN) {
      return 'Offen';
    } else if (value === TicketStatus.CLOSED) {
      return 'In Bearbeitung';
    } else if (value === TicketStatus.ACTIVE) {
      return 'Erledigt';
    } else {
      return value;
    }
  }
}
