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
import { ErrorComponent } from './shared/components/error/error.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';


const routes: Routes = [
  {
    path: 'tickets/:ticketId',
    component: TicketDetailsComponent,
    canActivate: [AuthGuardService],
    data: { pageName: 'Ticket-Details' },
    children: [
      { path: 'edit', component: TicketFormDialogEntryComponent, canActivate: [RoleGuardService], data: { expectedRole: 'support' } }
    ]
  },
  {
    path: 'tickets-overview',
    component: IssueOverviewComponent,
    canActivate: [AuthGuardService],
    data: { pageName: 'Ticket-Übersicht' },
    children: [
      { path: 'new', component: TicketFormDialogEntryComponent, pathMatch: 'full', canActivate: [AuthGuardService], data: { new: true } },
    ]
  },
  { path: 'tickets-overview/:ticketId', redirectTo: 'tickets/:ticketId', pathMatch: 'full' },
  {
    path: 'ticket-board',
    component: TicketBoardComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'support',
      pageName: 'Ticket-Board'
    },
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService], data: { pageName: 'Home' } },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
