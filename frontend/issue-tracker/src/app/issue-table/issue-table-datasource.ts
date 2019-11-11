import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, catchError, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, of } from 'rxjs';
import { TicketStatus, Ticket } from '../models/ticket.model';
import { TicketService } from '../ticket.service';


export interface IssueTableItem {
  ownerName: string;
  title: string;
  priority: string;
  lastEditorName: string;
  assignedTo: string;
  status: TicketStatus;
  lastEdited: Date;
}


/**
 * Data source for the IssueTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class IssueTableDataSource implements DataSource<Ticket> {
  data: IssueTableItem[];
  paginator: MatPaginator;
  sort: MatSort;

  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  private ticketsLengthSubject = new BehaviorSubject<number>(0);
  // indicate user when data is not fetched yet
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(private ticketService: TicketService) {
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Ticket[]> {
      return this.ticketsSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
    this.ticketsSubject.complete();
    this.loadingSubject.complete();
  }


  loadTickets(params: object) {
    this.loadingSubject.next(true);
    this.ticketService.getTickets(params).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false)))
      .subscribe(tickets => this.ticketsSubject.next(tickets));
  }

  $dataLength() {
    return this.ticketsSubject.asObservable().pipe(map(tickets => {
      return tickets.length;
    }),
    catchError(err => of(0))
    );
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: IssueTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: IssueTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.ownerName, b.ownerName, isAsc);
        case 'title': return compare(+a.title, +b.title, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
