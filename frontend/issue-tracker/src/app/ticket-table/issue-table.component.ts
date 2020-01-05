import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { IssueTableDataSource, IssueTableItem } from './issue-table-datasource';
import { TicketService } from '../ticket.service';
import { Observable, merge, Subscription, } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterParams } from './ticket-table-filters/issue-table-filters.component';


export interface PaginationParams {
  pageIndex: number | '';
  pageSize: number | '';
}

export interface SortParams {
  sortDir: 'asc' | 'desc' | '';
  sortBy: string;
}

export type PaginationSortParams = PaginationParams & SortParams;

export type TicketParams = FilterParams & PaginationSortParams;

@Component({
  selector: 'app-issue-table',
  templateUrl: './issue-table.component.html',
  styleUrls: ['./issue-table.component.scss']
})
export class IssueTableComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<IssueTableItem>;

  dataSource: IssueTableDataSource;
  $dataLength: Observable<number>;

  columnsSmallScreen = ['priority', 'status', 'category', 'title', 'lastEditorName', 'updatedAt'];
  columnsMiddleScreen = ['priority', 'status', 'category', 'title', 'affectedSystems', 'ownerName', 'lastEditorName', 'updatedAt'];
  columnsBigScreen = ['priority', 'status', 'category', 'title', 'affectedSystems', 'ownerName', 'lastEditorName', 'createdAt', 'updatedAt'];
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = this.columnsBigScreen;

  private filterParams: FilterParams = {
    filter: '',
    systems: [],
    openSelected: true,
    closedSelected: true,
    progressSelected: true,
    category: '',
    priority: '',
    editedDateStart: '',
    editedDateEnd: ''
  };

  private startParams: PaginationSortParams = {
    sortDir: '',
    sortBy: '',
    pageIndex: 0,
    pageSize: 50,
  };


  sliceTextAtPos = 100;

  watcher: Subscription;
  querySub: Subscription;

  constructor(
    private ticketService: TicketService,
    private mediaObserver: MediaObserver,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.dataSource = new IssueTableDataSource(this.ticketService);
    this.dataSource.loadTickets({ ...this.filterParams, ...this.startParams });
    this.$dataLength = this.dataSource.$dataLength();

    this.watcher = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm') {
        this.displayedColumns = this.columnsMiddleScreen;
      } else if (change.mqAlias === 'xs') {
        this.displayedColumns = this.columnsSmallScreen;
      } else {
        this.displayedColumns = this.columnsBigScreen;
      }
    });

    this.querySub = this.route.queryParamMap.subscribe((queryParamMap) => {
      // user deleted or updated ticket in dialog-component
      if (queryParamMap.get('reset')) {
        this.router.navigate(['./'], {relativeTo: this.route})
          .then(() => this.loadTicketsPage());
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

  ngOnDestroy() {
    this.watcher.unsubscribe();
    this.querySub.unsubscribe();
  }

  loadTicketsPage() {

    const params: TicketParams = {
      ...this.filterParams,
      sortDir: this.sort.direction || '',
      sortBy: this.sort.active || '',
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize || '',
    };
    this.dataSource.loadTickets(params);
  }

  filterChanged(filterParams: FilterParams) {
    this.paginator.pageIndex = 0;
    this.filterParams = filterParams;
    this.loadTicketsPage();
  }

  openDialog(ticketId: string) {
    this.router.navigate([ticketId], { relativeTo: this.route });
  }

  shouldSlice(str: string) {
    return Array.from(str).length > this.sliceTextAtPos;
  }

}
