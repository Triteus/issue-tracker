import { Component, OnInit, OnDestroy } from '@angular/core';
import { TicketFormDialogComponent } from '../ticket-form-dialog/ticket-form-dialog.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-form-dialog-entry',
  templateUrl: './ticket-form-dialog-entry.component.html',
  styleUrls: ['./ticket-form-dialog-entry.component.scss']
})
export class TicketFormDialogEntryComponent implements OnInit, OnDestroy {

  dialogSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.openDialog();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.dialogSub.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TicketFormDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { ticketId: this.route.snapshot.paramMap.get('ticketId') }
    });
    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      if (result === 'deleted' || result === 'updated') {
        this.router.navigate(['../'],
          {
            queryParams: { reset: true },
            relativeTo: this.route
          }
        );
      } else {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
      console.log('The dialog was closed');
    });
  }
}
