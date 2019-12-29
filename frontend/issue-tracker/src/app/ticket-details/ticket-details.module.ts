import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { TicketDetailsComponent } from './ticket-details.component';
import { TicketDetailsRoutingModule } from './ticket-details-routing.module';
import { DownloadModule } from '../download/download.module';



@NgModule({
  declarations: [TicketDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MaterialModule,
    DownloadModule,
  ],
  exports: [
    TicketDetailsComponent
  ]
})
export class TicketDetailsModule { }
