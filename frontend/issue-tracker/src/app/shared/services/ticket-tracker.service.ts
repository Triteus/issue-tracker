import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { Tracker } from '../../models/tracker.model';
import { ParamTrackerService } from 'src/app/param-tracker.service';
import { filter, switchMap, tap } from 'rxjs/operators';
import { TicketService } from 'src/app/ticket.service';


@Injectable({
  providedIn: 'root'
})
export class TicketTrackerService implements Tracker, OnDestroy {

  selectedTicketTitleSubject = new BehaviorSubject<string>('');
  subs: Subscription[] = [];

  constructor(private paramService: ParamTrackerService, private ticketService: TicketService) {
    this.subs.push(this.paramService.param$('ticketId')
      .pipe(
        // do not go on if there is no id
        filter((id) => !!id),
        // get name of project
        switchMap((id) => this.ticketService.getTicketTitle(id)))
      .subscribe((ticketTitle) => {
        this.selectedTicketTitleSubject.next(ticketTitle);
      }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  selectedObjectId$() {
    return this.paramService.param$('ticketId');
  }

  getSelectedObjectId() {
    return this.paramService.getParam('ticketId');
  }

  selectedObjectTitle$() {
    return this.selectedTicketTitleSubject.asObservable();
  }

  getSelectedObjectTitle() {
    return this.selectedTicketTitleSubject.getValue();
  }

  isObjectSelected() {
    return !!this.getSelectedObjectId();
  }

}
