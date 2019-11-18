import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule, MatSidenavModule, MatToolbar, MatToolbarModule,
  MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  MatInputModule, MatFormFieldModule, MatCheckboxModule,
  MatSelectModule, MatDatepickerModule, MatSnackBarModule, MatDialogModule, MatChipsModule } from '@angular/material/';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { IssueTableComponent } from './issue-table/issue-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { IssueOverviewComponent } from './issue-overview/issue-overview.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { IssueTableFiltersComponent } from './issue-table-filters/issue-table-filters.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule } from '@angular/forms';
import { MatSnackBarComponent } from './shared/components/mat-snack-bar/mat-snack-bar.component';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { TicketFormDialogComponent } from './ticket-form-dialog/ticket-form-dialog.component';
import { TicketFormDialogEntryComponent } from './ticket-form-dialog-entry/ticket-form-dialog-entry.component';
import { TaskListComponent } from './ticket-form-dialog/task-list/task-list.component';
import { TaskListItemComponent } from './ticket-form-dialog/task-list/task-list-item/task-list-item.component';
import { PriorityIconNamePipe } from './shared/pipes/priority.pipe';
import { StatusPipe } from './shared/pipes/status.pipe';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    IssueTableComponent,
    IssueOverviewComponent,
    IssueTableFiltersComponent,
    LoginComponent,
    RegisterComponent,
    MatSnackBarComponent,
    TicketFormDialogComponent,
    TicketFormDialogEntryComponent,
    TaskListComponent,
    TaskListItemComponent,
    PriorityIconNamePipe,
    StatusPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSliderModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    LayoutModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    JwtModule
  ],
  providers: [
    AuthService,
    AuthGuardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
      JwtHelperService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  entryComponents: [
    TicketFormDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
