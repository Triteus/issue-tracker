import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueTableComponent } from './issue-table.component';
import { IssueTableFiltersComponent } from './ticket-table-filters/issue-table-filters.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TicketFormModule } from '../ticket-form/ticket-form.module';
import { TicketFormDialogComponent } from '../ticket-form/ticket-form-dialog/ticket-form-dialog.component';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TicketTableRoutingModule } from './ticket-table-routing.module';


@NgModule({
  declarations: [
    IssueTableComponent,
    IssueTableFiltersComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    TicketFormModule,
    TicketTableRoutingModule
  ],
  exports: [
    IssueTableComponent,
    IssueTableFiltersComponent,
  ],
  entryComponents: [
    TicketFormDialogComponent,
    ConfirmationDialogComponent
  ],
})
export class TicketTableModule { }
