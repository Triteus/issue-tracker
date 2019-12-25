import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap, filter } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.model';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { ThemeService } from '../shared/services/theme.service';
import { Theme } from '../models/theme.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {


  @ViewChild('drawer', {static: false}) drawer;

  user$: Observable<User>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  theme$: Observable<Theme>;

  currentPage: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.user$ = this.authService.$user();
    this.theme$ = this.themeService.theme$();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleDrawer() {
    console.log('toggle');
    this.drawer.toggle();
  }

}
