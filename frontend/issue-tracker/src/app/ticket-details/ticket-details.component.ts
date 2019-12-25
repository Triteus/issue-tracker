import { Component, OnInit, OnDestroy } from '@angular/core';
import { TicketService } from '../ticket.service';
import { Observable, Subscription } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { take } from 'rxjs/operators';
import {Location} from '@angular/common';
import { TicketTrackerService } from '../shared/services/ticket-tracker.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit, OnDestroy {

  ticketId: string;
  ticket$: Observable<Ticket>;

  querySub: Subscription;
  paramSub: Subscription;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private delConfirmDialog: MatDialog,
    private location: Location,
    private ticketTrackerService: TicketTrackerService

  ) { }

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('ticketId');

    this.paramSub = this.route.paramMap.subscribe((paramMap) => {
      this.ticketId = paramMap.get('ticketId');
    });
    this.ticket$ = this.ticketService.getTicket(this.ticketId);

    this.querySub = this.route.queryParamMap.subscribe((queryParamMap) => {
      // user deleted or updated ticket in dialog-component
      if (queryParamMap.get('reset')) {
        this.router.navigate(['./'], { relativeTo: this.route }).then(() => {
          this.ticket$ = this.ticketService.getTicket(this.ticketId);
        });
      }
    });



  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
    this.paramSub.unsubscribe();
  }

  deleteTicket() {

    const dialogRef = this.delConfirmDialog.open(ConfirmationDialogComponent, {
      width: '500px',
      id: 'confirm-dialog',
      data: { message: 'Ticket wirklich löschen?' }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result === 'confirm') {
        this.ticketService.deleteTicket(this.ticketId)
          .pipe(take(1))
          .subscribe(() => {
            this.snackbar.open(`Ticket erfolgreich gelöscht!`, 'OK');
            this.location.back();
          }, err => {
            this.snackbar.open(`Ticket konnte nicht gelöscht werden: ${err.message}`, 'OK');
          });
      }
    });
  }

  openTicketForm() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

}
