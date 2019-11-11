import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IssueOverviewComponent } from './issue-overview/issue-overview.component';


const routes: Routes = [
  {path: '', redirectTo: '/overview', pathMatch: 'full'},
  {path: 'overview', component: IssueOverviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
