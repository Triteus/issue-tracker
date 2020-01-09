import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';


// NOTE routes are imported and included in another parent-routing-module.
// This routing module itself is now being imported anywhere for now.

export const userRoutes: Routes = [
  {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService], data: {pageName: 'Nutzerprofil'}}
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
