import { Routes, RouterModule } from '@angular/router';
import { TicketDetailsComponent } from './ticket-details.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { TicketFormDialogEntryComponent } from '../ticket-form/ticket-form-dialog-entry/ticket-form-dialog-entry.component';
import { RoleGuardService } from '../shared/services/role-guard.service';
import { NgModule } from '@angular/core';


export const ticketDetailsRoutes: Routes = [
  {
    path: 'tickets/:ticketId',
    component: TicketDetailsComponent,
    canActivate: [AuthGuardService],
    data: { pageName: 'Ticket-Details' },
    children: [
      {
        path: 'edit',
        component: TicketFormDialogEntryComponent,
        canActivate: [AuthGuardService],
        data: { pageName: 'Ticket-Formular' } }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(ticketDetailsRoutes)],
  exports: [RouterModule]
})
export class TicketDetailsRoutingModule { }
