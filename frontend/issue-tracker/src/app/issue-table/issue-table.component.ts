import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { IssueTableDataSource, IssueTableItem } from './issue-table-datasource';
import { TicketService } from '../ticket.service';
import { Observable, merge, Subscription, } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FilterParams } from '../issue-table-filters/issue-table-filters.component';
import { MediaObserver, MediaChange } from '@angular/flex-layout';



export interface PaginationSortParams {
  sortDir: 'asc' | 'desc' | '' | null;
  sortBy: string;
  pageIndex: number;
  pageSize: number;
}

export type TicketParams = FilterParams & PaginationSortParams;

@Component({
  selector: 'app-issue-table',
  templateUrl: './issue-table.component.html',
  styleUrls: ['./issue-table.component.css']
})
export class IssueTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<IssueTableItem>;
  dataSource: IssueTableDataSource;
  $dataLength: Observable<number>;

  columnsSmallScreen = ['ownerName', 'title', 'priority', 'lastEditorName', 'affectedSystems', 'updatedAt']
  columnsBigScreen = ['ownerName', 'title', 'description', 'priority', 'lastEditorName', 'affectedSystems', 'createdAt', 'updatedAt'];
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = this.columnsBigScreen;

  private filterParams: object;

  private startParams: TicketParams = {
    sortDir: null,
    sortBy: '',
    pageIndex: 0,
    pageSize: 50,
    filter: '',
    systems: [],
    openSelected: true,
    closedSelected: true,
    progressSelected: true,
    priority: null,
    editedDateStart: null,
    editedDateEnd: null
  };

  watcher: Subscription;

  constructor(private ticketService: TicketService, private mediaObserver: MediaObserver) {}

  ngOnInit() {
    this.dataSource = new IssueTableDataSource(this.ticketService);
    this.dataSource.loadTickets(this.startParams);
    this.$dataLength = this.dataSource.$dataLength();

    this.watcher = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if ( change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.displayedColumns = this.columnsSmallScreen;
      } else {
        this.displayedColumns = this.columnsBigScreen;
      }
    });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // reset paginator to first page after every sort
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadTicketsPage()))
      .subscribe();
  }

  loadTicketsPage() {

    const params = {
      sortDir: this.sort.direction,
      sortby: this.sort.active,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      ...this.filterParams
    };
    this.dataSource.loadTickets(params);
}

  filterChanged(filterParams: FilterParams) {
    this.paginator.pageIndex = 0;
    this.filterParams = filterParams;
    this.loadTicketsPage();
  }

}
