import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityIconComponent } from './components/priority-icon/priority-icon.component';
import { StatusIconComponent } from './components/status-icon/status-icon.component';
import { ErrorComponent } from './components/error/error.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ThemeSlideToggleComponent } from './components/theme-slide-toggle/theme-slide-toggle.component';
import { ThemePipe } from './pipes/theme.pipe';
import { PrioIconDirective } from './directives/prio-icon.directive';
import { StatusIconPipe } from './pipes/status-icon.pipe';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { StatusPipe } from './pipes/status-name.pipe';
import { PriorityNamePipe } from './pipes/priority-name.pipe';
import { PriorityIconNamePipe } from './pipes/priority-icon.pipe';
import { MaterialModule } from '../material.module';
import { CategoryNamePipe } from './pipes/category-name.pipe';
import { ProjectTypePipe } from './pipes/project-type.pipe';
import { ProjectStatusPipe } from './pipes/project-status.pipe';
import { HistoryComponent } from './components/history/history.component';
import { TicketPathNamePipe } from './pipes/ticket-path-name.pipe';



@NgModule({
  declarations: [
    PriorityIconComponent,
    StatusIconComponent,
    ErrorComponent,
    PageNotFoundComponent,
    ThemeSlideToggleComponent,
    ThemePipe,
    PrioIconDirective,
    StatusIconPipe,
    ConfirmationDialogComponent,
    StatusPipe,
    PriorityNamePipe,
    PriorityIconNamePipe,
    CategoryNamePipe,
    ProjectTypePipe,
    ProjectStatusPipe,
    HistoryComponent,
    TicketPathNamePipe,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    PriorityIconComponent,
    StatusIconComponent,
    ErrorComponent,
    PageNotFoundComponent,
    ThemeSlideToggleComponent,
    ThemePipe,
    PrioIconDirective,
    StatusIconPipe,
    ConfirmationDialogComponent,
    StatusPipe,
    PriorityNamePipe,
    PriorityIconNamePipe,
    CategoryNamePipe,
    ProjectTypePipe,
    ProjectStatusPipe,
    HistoryComponent,
    TicketPathNamePipe

  ]
})
export class SharedModule { }
