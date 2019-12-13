import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule, MatSidenavModule, MatToolbar, MatToolbarModule,
  MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  MatInputModule, MatFormFieldModule, MatCheckboxModule,
  MatSelectModule, MatDatepickerModule, MatSnackBarModule, MatDialogModule, MatChipsModule, MatTooltipModule, MatSlideToggleModule } from '@angular/material/';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarComponent } from './shared/components/mat-snack-bar/mat-snack-bar.component';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { TicketFormDialogComponent } from './ticket-form-dialog/ticket-form-dialog.component';
import { TicketFormDialogEntryComponent } from './ticket-form-dialog-entry/ticket-form-dialog-entry.component';
import { TaskListComponent } from './ticket-form-dialog/task-list/task-list.component';
import { TicketBoardComponent } from './ticket-board/ticket-board.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TicketBoardItemComponent } from './ticket-board/ticket-board-item/ticket-board-item.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { HomeComponent } from './home/home.component';
import { UploadModule } from './upload/upload.module';
import { DownloadModule } from './download/download.module';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material.module';

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
    TicketBoardComponent,
    TicketBoardItemComponent,
    HomeComponent,
    TicketDetailsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    JwtModule,
    UploadModule,
    DownloadModule,
    SharedModule,
    MaterialModule
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
    TicketFormDialogComponent,
    ConfirmationDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
