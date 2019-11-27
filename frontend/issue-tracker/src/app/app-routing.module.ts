import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IssueOverviewComponent } from './issue-overview/issue-overview.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { TicketFormDialogEntryComponent } from './ticket-form-dialog-entry/ticket-form-dialog-entry.component';
import { TicketBoardComponent } from './ticket-board/ticket-board.component';
import { RoleGuardService } from './shared/services/role-guard.service';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', redirectTo: '/tickets', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'tickets',
    component: IssueOverviewComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: ':ticketId', component: TicketFormDialogEntryComponent, pathMatch: 'full' }
    ]
  },
  {
    path: 'ticket-board',
    component: TicketBoardComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'support'
    },
    children: [
      {path: ':ticketId', component: TicketFormDialogEntryComponent, pathMatch: 'full'}
    ]
   },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
