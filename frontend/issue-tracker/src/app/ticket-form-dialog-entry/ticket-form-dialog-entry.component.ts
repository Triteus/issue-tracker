import { Component, OnInit } from '@angular/core';
import { TicketFormDialogComponent } from '../ticket-form-dialog/ticket-form-dialog.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-form-dialog-entry',
  templateUrl: './ticket-form-dialog-entry.component.html',
  styleUrls: ['./ticket-form-dialog-entry.component.sass']
})
export class TicketFormDialogEntryComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.openDialog();
  }

  ngOnInit() { }

  openDialog(): void {
    const dialogRef = this.dialog.open(TicketFormDialogComponent, {
      width: '250px',
      data: {ticketId: this.route.snapshot.paramMap.get('ticketId')}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.router.navigate(['../'], {relativeTo: this.route});
    });
  }
}
