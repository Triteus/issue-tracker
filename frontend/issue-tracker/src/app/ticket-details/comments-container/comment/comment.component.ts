import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UserComment } from 'src/app/models/comment.model';
import { AuthService } from 'src/app/auth/auth.service';
import { CommentService } from '../comment.service';
import { take, filter, mergeMap } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Output() commentDeleted = new EventEmitter<any>();

  @Input() comment: UserComment;
  @ViewChild('message', { static: false }) messageInput: ElementRef;

  constructor(
    private authService: AuthService,
    private commentService: CommentService,
    private delConfirmDialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  isAuthenticatedUser(userId: string) {
    return this.authService.isAuthenticatedUser(userId);
  }

  updateComment() {
    const message = this.messageInput.nativeElement.textContent;
    this.commentService.changeComment(this.comment.id, message)
      .pipe(take(1)).subscribe();
  }

  deleteComment() {
    const dialogRef = this.delConfirmDialog.open(ConfirmationDialogComponent, {
      width: '500px',
      id: 'confirm-dialog',
      data: { message: 'Kommentar wirklich löschen?' }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(res => res === 'confirm'),
        mergeMap(res => this.commentService.deleteComment(this.comment.id).pipe(take(1)))
      ).subscribe(() => {
        this.commentDeleted.emit();
        this.snackbar.open(`Kommentar gelöscht!`, 'OK');
      }, err => {
        this.snackbar.open(`Kommentar konnte nicht gelöscht werden: ${err.message}`, 'OK');
      });
  }

  wasUpdated() {
    return this.comment.createdAt !== this.comment.updatedAt;
  }
}
