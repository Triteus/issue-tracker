import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { NgModule } from '@angular/core';
import { ProjectFormDialogEntryComponent } from './project-form-dialog-entry/project-form-dialog-entry.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ticketTableRoutes } from '../ticket-table/ticket-table-routing.module';
import { ticketBoardRoutes } from '../ticket-board/ticket-board-routing.module';
import { ProjectUserFormDialogEntryComponent } from './project-user-form-dialog-entry/project-user-form-dialog-entry.component';

const routes: Routes = [
  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [AuthGuardService],
    data: {
      pageName: 'Projektübersicht'
    },
    children: [
      {
        path: 'new',
        component: ProjectFormDialogEntryComponent,
        canActivate: [AuthGuardService],
        data: { new: true, pageName: 'Projekt-Formular (neu)' },
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'projects/:projectId',
    component: ProjectDetailsComponent,
    canActivate: [AuthGuardService],
    data: {
      pageName: 'Projekt'
    },
    children: [
      {
        path: 'overview', component: ProjectOverviewComponent, data: { pageName: 'Übersicht' }, children: [
          {
            path: 'edit',
            component: ProjectFormDialogEntryComponent,
            canActivate: [AuthGuardService],
            data: {
              pageName: 'Projekt-Formular'
            }
          },
          {
            path: 'assigned-users',
            component: ProjectUserFormDialogEntryComponent,
            canActivate: [AuthGuardService],
            data: {
              pageName: 'Nutzer'
            }
          }
        ]
      },
      ...ticketTableRoutes,
      ...ticketBoardRoutes,
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
