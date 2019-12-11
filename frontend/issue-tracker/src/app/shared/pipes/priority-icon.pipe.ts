import { Pipe, PipeTransform } from '@angular/core';
import { MatIcon } from '@angular/material';
import { Priority } from 'src/app/models/ticket.model';

@Pipe({
  name: 'prioIconName'
})
export class PriorityIconNamePipe implements PipeTransform {

  transform(priority: Priority, ...args: any[]): any {
    switch (priority) {
      case Priority.HIGH: return 'keyboard_arrow_up';
      case Priority.VERY_HIGH: return 'double_arrow';
      case Priority.LOW: return 'keyboard_arrow_down';
      case Priority.MODERATE: return 'remove';
      default: return priority;
    }
  }
}
