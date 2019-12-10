import { Pipe, PipeTransform } from '@angular/core';
import { Theme } from 'src/app/models/theme.model';

@Pipe({
  name: 'theme'
})
export class ThemePipe implements PipeTransform {

  transform(theme: Theme, ...args: any[]): any {
    switch (theme) {
      case Theme.LIGHT: return 'Helles Design';
      case Theme.DARK: return 'Dunkles Design';
      default: return '';
    }
  }
}
