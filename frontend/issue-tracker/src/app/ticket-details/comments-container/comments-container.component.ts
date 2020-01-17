import { Component, OnInit, ViewChildren, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, merge, of, fromEvent, Subscription } from 'rxjs';
import { CommentService } from './comment.service';
import { UserComment } from '../../models/comment.model';
import { PaginationSortParams } from 'src/app/ticket-table/issue-table.component';
import { MatPaginator, MatSort, MatSelect } from '@angular/material';
import { tap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-comments-container',
  templateUrl: './comments-container.component.html',
  styleUrls: ['./comments-container.component.scss']
})
export class CommentsContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  comments$: Observable<UserComment[]>
  dataLength$: Observable<number>;

  subs: Subscription[] = [];

  @ViewChild('messageInput', { static: false }) messageInput: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('sortSelect', {static: false}) sortSelect: MatSelect;

  constructor(private commentService: CommentService, private authService: AuthService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.getComments();

    this.subs.push(this.sortSelect.valueChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    }));

    merge(this.paginator.page, this.sortSelect.valueChange)
      .subscribe(() => {
        this.getComments()
      })
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

  getComments() {
    const params: PaginationSortParams = {
      pageIndex: this.paginator.pageIndex || 0,
      pageSize: this.paginator.pageSize || 5,
      sortBy: 'createdAt',
      sortDir: this.sortSelect.value
    }
    this.comments$ = this.commentService.getCommentsAndCount(params)
    .pipe(
      tap((res) => this.dataLength$ = of(res.numComments)),
      map((res) => res.comments)
    );
  }

  addComment() {
    const message = this.messageInput.nativeElement.value;
    if (!message) {
      return;
    }
    this.commentService.addComment(message).subscribe(() => {
      this.getComments();
    });
  }


}
