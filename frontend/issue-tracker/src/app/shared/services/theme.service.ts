import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from 'src/app/models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // use a beaviourSubject so that every component can get currently activated theme by calling getTheme()
  private themeChangedSubject: BehaviorSubject<Theme>;

  constructor() {
    const theme = localStorage.getItem('theme') as Theme || Theme.LIGHT;
    this.themeChangedSubject =  new BehaviorSubject<Theme>(theme);
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
