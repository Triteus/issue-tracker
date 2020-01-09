import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketFormDialogComponent } from './ticket-form-dialog/ticket-form-dialog.component';
import { TicketFormDialogEntryComponent } from './ticket-form-dialog-entry/ticket-form-dialog-entry.component';
import { TaskListComponent } from './task-list/task-list.component';
import { MaterialModule } from '../material.module';
import { DownloadModule } from '../download/download.module';
import { UploadModule } from '../upload/upload.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TicketSystemsInputComponent } from './ticket-form-dialog/ticket-systems-input/ticket-systems-input.component';



@NgModule({
  declarations: [
    TicketFormDialogComponent,
    TicketFormDialogEntryComponent,
    TaskListComponent,
    TicketSystemsInputComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DownloadModule,
    UploadModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class TicketFormModule { }
