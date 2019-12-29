import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketBoardComponent } from './ticket-board.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';

// NOTE routes are imported and included in another parent-routing-module.
// This routing module itself is now being imported anywhere for now.
export const ticketBoardRoutes: Routes = [
  {
    path: 'ticket-board',
    component: TicketBoardComponent,
    canActivate: [AuthGuardService],
    data: {
      pageName: 'Ticket-Board'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(ticketBoardRoutes)],
  exports: [RouterModule]
})
export class TicketBoardRoutingModule { }
