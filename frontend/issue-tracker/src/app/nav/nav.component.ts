import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class NavComponent implements OnInit, OnDestroy {

  user$: Observable<User>;
  paramSub: Subscription;
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
    private route: ActivatedRoute,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.user$ = this.authService.$user();
    this.theme$ = this.themeService.theme$();

    this.paramSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.route.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data && child.snapshot.data.pageName) {
            return child.snapshot.data.pageName;
          } else {
            return null;
          }
        }
        return null;
      })).subscribe((pageName: string) => {
        this.currentPage = pageName;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }

  changeTheme() {

  }

}
