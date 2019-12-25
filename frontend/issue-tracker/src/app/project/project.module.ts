import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectFormDialogEntryComponent } from './project-form-dialog-entry/project-form-dialog-entry.component';
import { ProjectFormDialogComponent } from './project-form-dialog/project-form-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { MatTabsModule, MatToolbarModule} from '@angular/material';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { TicketTableModule } from '../ticket-table/ticket-table.module';
import { TicketDetailsModule } from '../ticket-details/ticket-details.module';


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectFormDialogEntryComponent,
    ProjectFormDialogComponent,
    ProjectDetailsComponent,
    ProjectOverviewComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
    SharedModule,
    MatToolbarModule,
    MaterialModule,
    TicketTableModule,
    ProjectRoutingModule,
    TicketDetailsModule,
  ],
  exports: [],
  entryComponents: [
    ProjectFormDialogComponent
  ]
})
export class ProjectModule { }