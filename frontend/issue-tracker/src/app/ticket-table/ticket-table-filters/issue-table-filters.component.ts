import { Component, AfterViewInit, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatSelect, MatCheckbox, MatDatepicker } from '@angular/material';
import { fromEvent, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Priority } from 'src/app/models/ticket.model';


export interface FilterParams {
  filter: string;
  openSelected: boolean;
  closedSelected: boolean;
  progressSelected: boolean;
  priority: Priority | '';
  systems: string[];
  editedDateStart: string | '';
  editedDateEnd: string | '';
}

@Component({
  selector: 'app-issue-table-filters',
  templateUrl: './issue-table-filters.component.html',
  styleUrls: ['./issue-table-filters.component.scss']
})
export class IssueTableFiltersComponent implements OnInit, AfterViewInit {

  @Output() paramsChanged = new EventEmitter<object>();

  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild('prioSelect', { static: false }) prioSelect: MatSelect;
  @ViewChild('systemsSelect', {static: false}) systemsSelect: MatSelect;

  @ViewChild('openCB', { static: false }) openCb: MatCheckbox;
  @ViewChild('progressCB', { static: false }) progressCb: MatCheckbox;
  @ViewChild('closedCB', { static: false }) closedCb: MatCheckbox;
  @ViewChild('startDate', { static: false }) startDate: ElementRef;
  @ViewChild('endDate', { static: false }) endDate: ElementRef;

  systems = environment.systems;

  constructor(
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() { }

  ngAfterViewInit() {

    // server-side search
    const $keyUpEvent = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
      );

    const $events = merge($keyUpEvent);
    $events.pipe(
      switchMap(() => {
        this.filterChanged();
        return of();
      })
    ).subscribe(() => { });
  }

  filterChanged() {
    const params: FilterParams = {
      filter: this.input.nativeElement.value,
      openSelected: this.openCb.checked,
      progressSelected: this.progressCb.checked,
      closedSelected: this.closedCb.checked,
      priority: this.prioSelect.value || '',
      systems: this.systemsSelect.value || '',
      // Note: toJSON() does not preserve timezone!
      editedDateStart: new Date(this.startDate.nativeElement.value).toJSON() || '',
      editedDateEnd: new Date(this.endDate.nativeElement.value).toJSON() || ''
    };
    this.paramsChanged.emit(params);
  }

  openTicketDialog() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
