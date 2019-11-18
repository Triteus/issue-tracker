import { Pipe, PipeTransform } from '@angular/core';
import { MatIcon } from '@angular/material';

@Pipe({
  name: 'prio_icon_name'
})
export class PriorityIconNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value === 'high') {
      return 'keyboard_arrow_up';
    } else if (value === 'very high') {
      return 'keyboard_drop_up';
    } else if (value === 'low') {
      return 'keyboard_arrow_down';
    } else {
      return value;
    }
  }

}
