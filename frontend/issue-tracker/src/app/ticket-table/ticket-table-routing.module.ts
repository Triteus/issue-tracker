import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { TicketFormDialogEntryComponent } from '../ticket-form/ticket-form-dialog-entry/ticket-form-dialog-entry.component';
import { IssueTableComponent } from './issue-table.component';
import { ticketDetailsRoutes } from '../ticket-details/ticket-details-routing.module';


// NOTE routes are imported and included in another parent-routing-module.
// This routing module itself is now being imported anywhere for now.

export const ticketTableRoutes: Routes = [
  {
    path: 'tickets', component: IssueTableComponent, data: { pageName: 'Tickets' },
    children: [
      {
        path: 'new',
        component: TicketFormDialogEntryComponent,
        canActivate: [AuthGuardService],
        data: { pageName: 'Ticket-Formular (neu)', new: true }
      },
    ]
  },
  ...ticketDetailsRoutes, // MUST COME AFTER tickets/new!!!
  { path: 'tickets-overview/:ticketId', redirectTo: 'tickets/:ticketId', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(ticketTableRoutes)],
  exports: [RouterModule]
})
export class TicketTableRoutingModule { }
