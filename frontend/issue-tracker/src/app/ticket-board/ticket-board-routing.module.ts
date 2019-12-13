import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketBoardComponent } from './ticket-board.component';
import { RoleGuardService } from '../shared/services/role-guard.service';
import { AuthGuardService } from '../shared/services/auth-guard.service';


const routes: Routes = [
  {
    path: 'ticket-board',
    component: TicketBoardComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: {
      expectedRole: 'support',
      pageName: 'Ticket-Board'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketBoardRoutingModule { }
