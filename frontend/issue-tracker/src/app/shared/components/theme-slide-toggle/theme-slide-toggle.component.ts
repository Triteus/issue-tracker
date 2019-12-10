import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Theme } from 'src/app/models/theme.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-slide-toggle',
  templateUrl: './theme-slide-toggle.component.html',
  styleUrls: ['./theme-slide-toggle.component.scss']
})
export class ThemeSlideToggleComponent implements OnInit {

  constructor(private themeService: ThemeService) { }

  theme$: Observable<Theme>;

  ngOnInit() {
    this.theme$ = this.themeService.theme$();
  }

  changeTheme() {
    const theme = this.themeService.getTheme();
    if (theme === Theme.LIGHT) {
      this.themeService.changeTheme(Theme.DARK);
    } else {
      this.themeService.changeTheme(Theme.LIGHT);
    }
  }

}
