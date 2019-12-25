import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay, filter } from 'rxjs/operators';
import { Theme } from 'src/app/models/theme.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  user$: Observable<User>;
  paramSub: Subscription;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  theme$: Observable<Theme>;

  currentPage: string;

  @Output() toggleDrawer = new EventEmitter<any>();

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

  toggeButtonPressed() {
    this.toggleDrawer.emit();
  }
}
