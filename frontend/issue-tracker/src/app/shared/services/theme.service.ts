import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from 'src/app/models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themeChangedSubject = new BehaviorSubject<Theme>(Theme.LIGHT);

  constructor() {
    const theme = localStorage.getItem('theme') as Theme || Theme.LIGHT;
    this.themeChangedSubject.next(theme);
  }


  changeTheme(theme: Theme) {
    localStorage.setItem('theme', theme);
    this.themeChangedSubject.next(theme);
  }

  theme$() {
    return this.themeChangedSubject.asObservable();
  }

  getTheme() {
    return this.themeChangedSubject.getValue();
  }

}
