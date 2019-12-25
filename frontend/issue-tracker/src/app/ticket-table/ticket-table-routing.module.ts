import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { TicketFormDialogEntryComponent } from '../ticket-form/ticket-form-dialog-entry/ticket-form-dialog-entry.component';
import { TicketDetailsComponent } from '../ticket-details/ticket-details.component';
import { RoleGuardService } from '../shared/services/role-guard.service';


// NOTE routes are imported and included in another parent-routing-module.
// This routing module itself is now being imported anywhere for now.

export const ticketTableRoutes: Routes = [
  {
    path: 'tickets/:ticketId',
    component: TicketDetailsComponent,
    canActivate: [AuthGuardService],
    data: { pageName: 'Ticket-Details' },
    children: [
      {
        path: 'edit',
        component: TicketFormDialogEntryComponent,
        canActivate: [AuthGuardService, RoleGuardService],
        data: { expectedRole: 'support' }
      }
    ]
  },
  { path: 'tickets-overview/:ticketId', redirectTo: 'tickets/:ticketId', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(ticketTableRoutes)],
  exports: [RouterModule]
})
export class TicketTableRoutingModule { }
