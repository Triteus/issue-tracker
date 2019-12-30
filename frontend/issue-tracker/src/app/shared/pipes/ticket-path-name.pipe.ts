import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ticketPathName'
})
export class TicketPathNamePipe implements PipeTransform {

  transform(path: string): any {
    switch (path) {
      case 'title': return 'Titel';
      case 'description': return 'Beschreibung';
      case 'status': return 'Status';
      case 'category': return 'Kategorie';
      case 'filenames': return 'Dateien';
      case 'affectedSystems': return 'Betroffene Systeme';
      case 'priority': return 'Priorität';
      case 'subTasks': return 'Teilaufgaben';
      default: return '';
    }
  }
}
