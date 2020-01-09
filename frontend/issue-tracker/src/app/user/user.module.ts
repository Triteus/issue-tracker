import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { UserProfileFormComponent } from './user-profile/user-profile-form/user-profile-form.component';
import { UsernameFormComponent } from './user-profile/username-form/username-form.component';
import { PasswordFormComponent } from './user-profile/password-form/password-form.component';
import { EmailFormComponent } from './user-profile/email-form/email-form.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [UserProfileComponent, UserProfileFormComponent, UsernameFormComponent, PasswordFormComponent, EmailFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    UserRoutingModule
  ],
  exports: [
    UserProfileComponent,

  ]
})
export class UserModule { }
