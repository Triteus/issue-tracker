import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Ticket } from 'src/app/models/ticket.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, switchMap, filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TicketBoardService } from '../ticket-board.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-board-item',
  templateUrl: './ticket-board-item.component.html',
  styleUrls: ['./ticket-board-item.component.scss']
})
export class TicketBoardItemComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() ticket: Ticket;
  @Input() pendingStatus: boolean;

  @ViewChild('title', { static: false }) titleInput: any;

  numSubTasks = 0;
  lastTitleValue: string;
  ticketPreviewForm = new FormGroup({
    title: new FormControl({ value: '', disabled: this.pendingStatus }),
  });

  constructor(
    private ticketBoardService: TicketBoardService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.numSubTasks = this.ticket.subTasks.reduce((prev, curr) => {
      return (curr.isDone ? prev + 1 : prev);
    }, 0);
    this.lastTitleValue = this.ticket.title;
    this.ticketPreviewForm.patchValue(this.ticket);
  }

  ngOnChanges(values: SimpleChanges) {
    if (!values.pendingStatus) {
      return;
    }

    if (values.pendingStatus.currentValue) {
      this.title.disable();
    } else {
      this.title.enable();
    }
  }

  get title() {
    return this.ticketPreviewForm.get('title') as FormControl;
  }

  ngAfterViewInit() {
    this.title.valueChanges.pipe(
      // only update if len of title >= 4
      filter((val) => val.length >= 4),
      // wait 350ms and cancel curr observable if new one occurs
      debounceTime(350),
      // cancel observable if val is the same
      distinctUntilChanged(),
      // cancel curr request to change title, if there is any
      switchMap((val) => {
        return this.ticketBoardService.changeTitle(val, this.ticket.id);
      }),
      // set title to previous value if an error occured
      catchError(() => {
        this.ticketPreviewForm.get('title').setValue(this.lastTitleValue);
        return of();
      }),
      tap((val) => {
        this.lastTitleValue = val;
      })
    ).subscribe();
  }

  openTicketForm() {
    this.router.navigate([this.ticket.id], { relativeTo: this.route });
  }
}
