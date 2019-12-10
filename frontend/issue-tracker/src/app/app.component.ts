import { Component, OnInit } from '@angular/core';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Theme } from './models/theme.model';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'issue-tracker';

  oldTheme: Theme;
  theme: Theme;

  constructor(
    private overlayContainer: OverlayContainer,
    private themeService: ThemeService
  ) {
  }

  ngOnInit() {
    // get initial theme
    this.theme = this.oldTheme = this.themeService.getTheme();
    this.overlayContainer.getContainerElement().classList.add(this.theme);

    // update theme
    this.themeService.theme$().subscribe((updatedTheme) => {
      this.oldTheme = this.theme;
      this.theme = updatedTheme;
      this.overlayContainer.getContainerElement().classList.replace(this.oldTheme, this.theme);
    });
  }

}
