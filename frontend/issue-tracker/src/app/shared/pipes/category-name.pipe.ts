import { Pipe, PipeTransform } from '@angular/core';
import { TicketCategory } from 'src/app/models/ticket.model';

@Pipe({
  name: 'categoryName'
})
export class CategoryNamePipe implements PipeTransform {
  transform(category: TicketCategory): string {
    switch (category) {
      case TicketCategory.BUG: return 'Bug';
      case TicketCategory.FEATURE: return 'Feature';
      case TicketCategory.INFO: return 'Information';
      case TicketCategory.OTHER: return 'Sonstiges';
      case TicketCategory.REQUEST: return 'Anfrage';
      case TicketCategory.SUGGESTION: return 'Vorschlag';
      default: return '';
    }
  }
}
