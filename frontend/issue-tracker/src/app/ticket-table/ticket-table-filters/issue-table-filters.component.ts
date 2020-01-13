import { Component, AfterViewInit, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatSelect, MatCheckbox, MatDatepicker } from '@angular/material';
import { fromEvent, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Priority, priorityArr, ticketCategoryArr, TicketCategory } from 'src/app/models/ticket.model';


export interface FilterParams {
  filter: string;
  openSelected: boolean;
  closedSelected: boolean;
  progressSelected: boolean;
  priority: Priority | '';
  category: TicketCategory | '';
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
  @ViewChild('categorySelect', {static: false}) categorySelect: MatSelect;

  @ViewChild('openCB', { static: false }) openCb: MatCheckbox;
  @ViewChild('progressCB', { static: false }) progressCb: MatCheckbox;
  @ViewChild('closedCB', { static: false }) closedCb: MatCheckbox;
  @ViewChild('startDate', { static: false }) startDate: ElementRef;
  @ViewChild('endDate', { static: false }) endDate: ElementRef;

  systems = environment.systems;
  priorityArr = priorityArr;
  categoryArr = ticketCategoryArr;

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
      category: this.categorySelect.value || '',
      systems: this.systemsSelect.value || '',
      // Note: toJSON() does not preserve timezone!
      editedDateStart: this.localeDEStringToJSONDate(this.startDate.nativeElement.value) || '',
      editedDateEnd: this.localeDEStringToJSONDate(this.endDate.nativeElement.value) || ''
    };
    this.paramsChanged.emit(params);
  }

  private localeDEStringToJSONDate(value: string) {
    const [day, month , year] = value.split('.').map(str => Number.parseInt(str, 10));
    return new Date(year, month - 1, day, 1).toJSON();
  }

  openTicketDialog() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
