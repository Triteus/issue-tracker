import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketBoardComponent } from './ticket-board.component';
import { TicketBoardItemComponent } from './ticket-board-item/ticket-board-item.component';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TicketBoardColumnComponent } from './ticket-board-column/ticket-board-column.component';

@NgModule({
  declarations: [
    TicketBoardComponent,
    TicketBoardItemComponent,
    TicketBoardColumnComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    DragDropModule,
  ],
   exports: [
    TicketBoardComponent,
    TicketBoardItemComponent,
   ]
})
export class TicketBoardModule { }
