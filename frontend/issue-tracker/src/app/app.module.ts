import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarComponent } from './shared/components/mat-snack-bar/mat-snack-bar.component';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { HomeComponent } from './home/home.component';
import { DownloadModule } from './download/download.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material.module';
import { TicketBoardModule } from './ticket-board/ticket-board.module';
import { TicketFormDialogComponent } from './ticket-form/ticket-form-dialog/ticket-form-dialog.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { ProjectModule } from './project/project.module';
import { SidenavContentComponent } from './nav/sidenav-content/sidenav-content.component';
import { NavbarComponent } from './nav/navbar/navbar.component';
import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
import { StatsCardComponent } from './home/stats-card/stats-card.component';
import { UserModule } from './user/user.module';

registerLocaleData(localeDE);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    MatSnackBarComponent,
    HomeComponent,
    SidenavContentComponent,
    NavbarComponent,
    StatsCardComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule,
    SharedModule,
    MaterialModule,
    DownloadModule,
    TicketBoardModule,
    ProjectModule,
    UserModule,
    AppRoutingModule, // make sure root routing module is at the bottom
  ],
  providers: [
    AuthGuardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    { provide: LOCALE_ID, useValue: 'de' },
  ],
  entryComponents: [
    TicketFormDialogComponent,
    ConfirmationDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
