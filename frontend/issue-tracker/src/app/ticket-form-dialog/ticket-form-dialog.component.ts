import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { Observable, of } from 'rxjs';
import { Ticket, TicketStatus, Priority } from '../models/ticket.model';
import { TicketService } from '../ticket.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { tap, take } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-ticket-form-dialog',
  templateUrl: './ticket-form-dialog.component.html',
  styleUrls: ['./ticket-form-dialog.component.sass']
})
export class TicketFormDialogComponent implements OnInit {

  ticket$: Observable<Ticket>;
  initialTicket: Ticket;
  ticketStatusArr = Object.values(TicketStatus);
  priorityArr = Object.values(Priority);
  systemsArr = ['JIRA', 'Outlook', 'Confluence'];

  editMode = true;

  ticketForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
    status: new FormControl(TicketStatus.OPEN, [Validators.required]),
    priority: new FormControl(Priority.LOW, [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(1000)]),
    affectedSystems: new FormControl(''),
    subTasks: new FormArray([])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { ticketId: string },
    private ticketService: TicketService,
    public ticketDialogRef: MatDialogRef<TicketFormDialogComponent>,
    private delConfirmDialog: MatDialog,
    private snackbar: MatSnackBar,
  ) { }


  ngOnInit() {
    if (this.data.ticketId === 'new') {
      // create new ticket -> empty dialog
      this.ticket$ = of(this.ticketForm.value);
      this.editMode = false;
    } else {
      // existing dialog -> fill dialog with ticket-data
      this.ticket$ = this.ticketService.getTicket(this.data.ticketId)
        .pipe(
          tap((ticket) => {
            this.initialTicket = ticket;
            this.patchTicketForm(ticket);
          })
        );
    }
  }

  private patchTicketForm(ticket: Ticket) {
    this.ticketForm.patchValue(ticket);
    ticket.subTasks.forEach((task) => {
      this.subTasks.push(new FormGroup({
        description: new FormControl(task.description, Validators.required),
        isDone: new FormControl(task.isDone, Validators.required)
      }));
    });
  }


  get title() {
    return this.ticketForm.get('title') as FormControl;
  }

  get status() {
    return this.ticketForm.get('status') as FormControl;
  }

  get priority() {
    return this.ticketForm.get('priority') as FormControl;
  }

  get description() {
    return this.ticketForm.get('description') as FormControl;
  }

  get affectedSystems() {
    return this.ticketForm.get('affectedSystems') as FormControl;
  }

  get subTasks() {
    return this.ticketForm.get('subTasks') as FormArray;
  }

  updateTicket() {
    const request = this.editMode ?
      this.ticketService.editTicket(this.ticketForm.value, this.data.ticketId) :
      this.ticketService.postTicket(this.ticketForm.value);

    request.pipe(take(1))
      .subscribe(() => {
        this.ticketDialogRef.close('updated');
        this.snackbar.open(`Ticket "${this.ticketForm.value.title}" erfolgreich aktualisiert!`, 'OK');
      });
  }

  deleteTicket() {

    const dialogRef = this.delConfirmDialog.open(ConfirmationDialogComponent, {
      width: '500px',
      id: 'confirm-dialog',
      data: { message: 'Ticket wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.ticketService.deleteTicket(this.data.ticketId)
          .pipe(take(1))
          .subscribe(() => {
            this.ticketDialogRef.close('deleted');
            this.snackbar.open(`Ticket "${this.ticketForm.value.title}" erfolgreich gelöscht!`, 'OK');
          });
      }
    });
  }

  resetTicket() {
    this.subTasks.clear();
    this.patchTicketForm(this.initialTicket);
  }

  updateStatus() {

  }


  updateTasks() {

  }

}

