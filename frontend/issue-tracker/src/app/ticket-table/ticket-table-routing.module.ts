import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IssueTableComponent } from './issue-table.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { TicketFormDialogEntryComponent } from '../ticket-form/ticket-form-dialog-entry/ticket-form-dialog-entry.component';



const ticketTableRoutes: Routes = [
  {
    path: 'tickets-overview',
    component: IssueTableComponent,
    canActivate: [AuthGuardService],
    data: { pageName: 'Ticket-Übersicht' },
    children: [
      { path: 'new', component: TicketFormDialogEntryComponent, pathMatch: 'full', canActivate: [AuthGuardService], data: { new: true } },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(ticketTableRoutes)],
  exports: [RouterModule]
})
export class TicketTableRoutingModule { }
