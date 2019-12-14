import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { Observable, of, Subscription } from 'rxjs';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { tap, take, map } from 'rxjs/operators';
import { Ticket, TicketStatus, Priority } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/ticket.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-ticket-form-dialog',
  templateUrl: './ticket-form-dialog.component.html',
  styleUrls: ['./ticket-form-dialog.component.scss']
})
export class TicketFormDialogComponent implements OnInit, OnDestroy {

  ticket$: Observable<Ticket>;
  initialTicket: Ticket;
  ticketStatusArr = Object.values(TicketStatus);
  priorityArr = Object.values(Priority);
  systemsArr = ['jira', 'outlook', 'confluence'];

  backDropSub: Subscription;

  editMode = true;

  isUploadingFiles: boolean;

  ticketForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
    status: new FormControl(TicketStatus.OPEN, [Validators.required]),
    priority: new FormControl(Priority.LOW, [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(1000)]),
    affectedSystems: new FormControl([]),
    subTasks: new FormArray([]),
    newFilenames: new FormControl([]),
    existingFilenames: new FormControl([])
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
    this.isUploadingFiles = false;
    if (this.data.ticketId === 'new') {
      // create new ticket -> empty dialog
      this.ticket$ = of(this.ticketForm.value);
      this.initialTicket = this.ticketForm.value;
      this.editMode = false;
    } else {
      // existing dialog -> fill dialog with ticket-data
      this.ticket$ = this.ticketService.getTicket(this.data.ticketId)
        .pipe(
          tap((ticket) => {
            this.patchTicketForm(ticket);
            this.initialTicket = ticket;
          })
        );
    }

    this.ticketDialogRef.disableClose = true;
    this.backDropSub = this.ticketDialogRef.backdropClick().subscribe(() => {

      if (this.editMode && this.ticketForm.dirty) {
        const dialogRef = this.delConfirmDialog.open(ConfirmationDialogComponent, {
          width: '500px',
          id: 'confirm-dialog',
          data: { message: 'Ticket wirklich schließen? Ungespeicherte Änderungen gehen verloren!' }
        });

        return dialogRef.afterClosed().pipe(
          tap((res: string) => {
            if (res === 'confirm') {
              this.ticketDialogRef.close();
            }
          })
        ).subscribe();
      }
      this.ticketDialogRef.close();
    });
  }

  ngOnDestroy() {
    this.backDropSub.unsubscribe();
  }

  private patchTicketForm(ticket: Ticket) {
    this.ticketForm.patchValue(ticket);

    // filenames in form are split up between filenames
    // that user just uploaded (newFilenames) and filenames that were already added (existingFilenames)
    this.existingFilenames.setValue(ticket.filenames);

    // create formgroup for every subtask
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

  get newFilenames() {
    return this.ticketForm.get('newFilenames') as FormControl;
  }

  get existingFilenames() {
    return this.ticketForm.get('existingFilenames') as FormControl;
  }

  get subTasks() {
    return this.ticketForm.get('subTasks') as FormArray;
  }

  isUploading(val: boolean) {
    // use setTimeout to fix ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.isUploadingFiles = val;
    }, 0);
  }

  addNewFileNames(filenames: string[]) {
    setTimeout(() => {
      this.newFilenames.setValue(filenames);
    }, 0);
  }

  canSubmit() {
      return this.ticketForm.valid && !this.isUploadingFiles;
  }

  updateTicket() {

    // combine newly added filenames with existing filenames
    const {newFilenames, existingFilenames, ...value} = this.ticketForm.value;
    const valueToSubmit = {
      ...value,
      filenames: [...newFilenames, ...existingFilenames]
    };

    const request = this.editMode ?
      this.ticketService.editTicket(valueToSubmit, this.data.ticketId) :
      this.ticketService.postTicket(valueToSubmit);

    request.pipe(take(1))
      .subscribe(() => {
        this.ticketDialogRef.close('updated');
        this.snackbar.open(`Ticket "${this.ticketForm.value.title}" erfolgreich aktualisiert!`, 'OK');
      }, err => {
        this.snackbar.open(`Ticket "${this.ticketForm.value.title}" konnte nicht aktualisiert werden: ${err.message}`, 'OK');
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
          }, err => {
            this.snackbar.open(`Ticket "${this.ticketForm.value.title}" konnte nicht gelöscht werden: ${err.message}`, 'OK');
          });
      }
    });
  }

  resetTicket() {
    this.subTasks.clear();
    this.ticketForm.reset();
    this.newFilenames.setValue([]);
    this.patchTicketForm(this.initialTicket);
  }

  updateStatus() {}


  updateTasks() {}


}

