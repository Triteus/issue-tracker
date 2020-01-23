import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ticket, TicketStatus } from 'src/app/models/ticket.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TicketBoardService } from '../ticket-board.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-ticket-board-column',
  templateUrl: './ticket-board-column.component.html',
  styleUrls: ['./ticket-board-column.component.scss']
})
export class TicketBoardColumnComponent implements OnInit {

  @Input() tickets: Ticket[] = [];
  @Input() dragDisabled: boolean;
  @Input() colName: string;
  @Input() status: TicketStatus;

  @Output() loadingStatusChanged = new EventEmitter<boolean>();

  constructor(private ticketBoardService: TicketBoardService, private snackBar: MatSnackBar) { }

  ngOnInit() {}

  drop(event: CdkDragDrop<Ticket[]>) {

    const { previousContainer, container, previousIndex, currentIndex } = event;
    if (previousContainer === container) {
      moveItemInArray(container.data, previousIndex, currentIndex);
      // TODO locally save position of item within list
    } else {
      const ticketId = previousContainer.data[previousIndex].id;
      transferArrayItem(previousContainer.data,
        container.data,
        previousIndex,
        currentIndex);

      this.loadingStatusChanged.emit(true);
      // status can be grabbed from HTML-element as data-attribute
      const status = container.element.nativeElement.dataset.status as TicketStatus;
      this.ticketBoardService.changeStatus(status, ticketId)
        .subscribe(
          res => {
            this.loadingStatusChanged.emit(false);
          },
          err => {
            // move item back
            transferArrayItem(container.data,
              previousContainer.data,
              currentIndex,
              previousIndex);

            this.loadingStatusChanged.emit(false);
            this.snackBar.open('Status konnte nicht aktualisiert werden!', 'OK', { duration: 3000 });
          });
    }
  }

}
