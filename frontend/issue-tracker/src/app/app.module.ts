import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

import { SidenavContentComponent } from './nav/sidenav-content/sidenav-content.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    MatSnackBarComponent,
    HomeComponent,
    SidenavContentComponent,

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
    TicketTableModule,
    TicketDetailsModule,
    AppRoutingModule, // make sure root routing module is at the bottom
  ],
  providers: [
    AuthService,
    AuthGuardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
      JwtHelperService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  entryComponents: [
    TicketFormDialogComponent,
    ConfirmationDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
