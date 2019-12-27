import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable, Subscription, of, fromEvent } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar, MatCheckboxChange } from '@angular/material';
import { ProjectService } from '../project.service';
import { ProjectFormDialogComponent } from '../project-form-dialog/project-form-dialog.component';
import { tap, take, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ProjectTrackerService } from 'src/app/shared/services/project-tracker.service';

@Component({
  selector: 'app-project-user-form-dialog',
  templateUrl: './project-user-form-dialog.component.html',
  styleUrls: ['./project-user-form-dialog.component.scss']
})
export class ProjectUserFormDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('search', { static: false }) search: ElementRef;

  allUsers$: Observable<User[]>;
  assignedUserIds: string[] = [];
  projectId: string;

  subs: Subscription[] = [];

  isDirty = false;
  assignedUsersOnly = false;

  constructor(
    public projectDialogRef: MatDialogRef<ProjectFormDialogComponent>,
    private delConfirmDialog: MatDialog,
    private snackbar: MatSnackBar,
    public userDialogRef: MatDialogRef<ProjectUserFormDialogComponent>,
    private userService: UserService,
    private projectService: ProjectService,
    private projectTrackerService: ProjectTrackerService
  ) { }

  ngOnInit() {
    this.allUsers$ = this.userService.getUsers();
    this.projectId = this.projectTrackerService.getSelectedObjectId();

    this.subs.push(this.projectService.getAssignedUsers(this.projectId)
      .pipe(take(1))
      .subscribe((users) => {
        this.assignedUserIds = users;
      }));

    this.userDialogRef.disableClose = true;
    this.subs.push(this.userDialogRef.backdropClick().subscribe(() => {
      if (this.isDirty) {
        this.userDialogRef.close('updated');
      } else {
        this.userDialogRef.close();
      }
    }));
  }

  ngAfterViewInit() {
    this.subs.push(fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
      ).subscribe(() => {
        this.filterUsers(this.assignedUsersOnly);
      }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  isUserAssigned(userId: string) {
    return this.assignedUserIds.includes(userId);
  }

  addAssignedUser(userId: string) {
    this.isDirty = true;

    this.projectService.patchAssignedUsers([...this.assignedUserIds, userId], this.projectId)
      .pipe(take(1)).subscribe(() => {
        this.snackbar.open('Nutzer erfolgreich zum Projekt hinzugefügt!', 'OK');
        this.assignedUserIds.push(userId);
      });
  }

  deleteAssignedUser(userId: string) {
    this.isDirty = true;

    const dialogRef = this.delConfirmDialog.open(ConfirmationDialogComponent, {
      width: '500px',
      id: 'confirm-dialog',
      data: { message: 'Nutzer wirklich vom Projekt entfernen?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.projectService.patchAssignedUsers(this.assignedUserIds.filter(id => id !== userId), this.projectId)
          .pipe(take(1))
          .subscribe(() => {
            this.assignedUserIds = this.assignedUserIds.filter((id) => id !== userId);
            this.snackbar.open(`Nutzer vom Projekt erfolgreich entfernt!`, 'OK');
          }, err => {
            this.snackbar.open(`Nutzer konnte nicht vom Projekt entfernt werden: ${err.message}`, 'OK');
          });
      }
    });
  }

  selectionChanged(event: MatCheckboxChange) {
    this.assignedUsersOnly = event.checked;
    this.filterUsers(this.assignedUsersOnly);
  }

  filterUsers(assignedUsersOnly: boolean) {
    if (assignedUsersOnly) {
      this.allUsers$ = this.assignedUsers$;
    } else {
      this.allUsers$ = this.userService.getUsers(this.search.nativeElement.value);
    }
  }

  get assignedUsers$() {
    return this.userService.getUsers(this.search.nativeElement.value)
      .pipe(
        map((users) => users.filter(u => this.assignedUserIds.includes(u.id)))
      );
  }
}
