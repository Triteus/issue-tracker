import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from 'src/app/models/ticket.model';

@Pipe({
  name: 'priorityName'
})
export class PriorityNamePipe implements PipeTransform {

  transform(priority: Priority, ...args: any[]): any {
    switch (priority) {
      case Priority.HIGH: return 'Hoch';
      case Priority.VERY_HIGH: return 'Sehr hoch';
      case Priority.LOW: return 'Niedrig';
      case Priority.MODERATE: return 'Mittel';
      default: return priority;
    }
  }
}
