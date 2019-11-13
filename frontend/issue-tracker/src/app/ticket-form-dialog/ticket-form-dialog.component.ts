import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ticket-form-dialog',
  templateUrl: './ticket-form-dialog.component.html',
  styleUrls: ['./ticket-form-dialog.component.sass']
})
export class TicketFormDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  
  ngOnInit() {
  }

}
