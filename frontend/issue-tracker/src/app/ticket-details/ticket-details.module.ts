import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { TicketDetailsComponent } from './ticket-details.component';
import { TicketDetailsRoutingModule } from './ticket-details-routing.module';
import { DownloadModule } from '../download/download.module';
import { CommentsContainerComponent } from './comments-container/comments-container.component';
import { CommentsListComponent } from './comments-container/comments-list/comments-list.component';
import { CommentComponent } from './comments-container/comment/comment.component';
import { ContenteditableModule } from '@ng-stack/contenteditable';


@NgModule({
  declarations: [TicketDetailsComponent, CommentsContainerComponent, CommentsListComponent, CommentComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MaterialModule,
    DownloadModule,
    ContenteditableModule
  ],
  exports: [
    TicketDetailsComponent
  ]
})
export class TicketDetailsModule { }
