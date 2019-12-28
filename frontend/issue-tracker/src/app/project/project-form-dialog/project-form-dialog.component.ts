import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { Project, projectStatusArr, projectTypeArr, ProjectType, ProjectStatus } from 'src/app/models/project.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { ProjectService } from '../project.service';
import { tap, take } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-project-form-dialog',
  templateUrl: './project-form-dialog.component.html',
  styleUrls: ['./project-form-dialog.component.scss']
})
export class ProjectFormDialogComponent implements OnInit, OnDestroy {

  project$: Observable<Project>;
  initialProject: Project;
  projectStatusArr = projectStatusArr;
  projectTypeArr = projectTypeArr;

  backDropSub: Subscription;

  editMode = true;

  projectForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(4), Validators.maxLength(50)]),
    description: new FormControl('', [Validators.minLength(4), Validators.maxLength(5000)]),
    type: new FormControl(ProjectType.DEV, [Validators.required]),
    status: new FormControl(ProjectStatus.OPEN, [Validators.required]),
    assignedUsers: new FormControl([]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { projectId: string },
    private projectService: ProjectService,
    public projectDialogRef: MatDialogRef<ProjectFormDialogComponent>,
    private delConfirmDialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.data.projectId === 'new') {
      this.project$ = of(this.projectForm.value);
      this.initialProject = this.projectForm.value;
      this.editMode = false;
    } else {
      this.project$ = this.projectService.getProject(this.data.projectId).
        pipe(
          tap((project) => {
            this.projectForm.patchValue(project);
            this.initialProject = project;
          })
        );
    }

    this.projectDialogRef.disableClose = true;
    this.backDropSub = this.projectDialogRef.backdropClick().subscribe(() => {
      if (this.editMode && this.projectForm.dirty) {
        const dialogRef = this.delConfirmDialog.open(ConfirmationDialogComponent, {
          width: '500px',
          id: 'confirm-dialog',
          data: { message: 'Projekt-Formular wirklich schließen? Ungespeicherte Änderungen gehen verloren!' }
        });

        return dialogRef.afterClosed().pipe(
          tap((res: string) => {
            if (res === 'confirm') {
              this.projectDialogRef.close();
            }
          })
        ).subscribe();
      }
      this.projectDialogRef.close();
    });
  }

  ngOnDestroy() {
    this.backDropSub.unsubscribe();
  }

  get name() {
    return this.projectForm.get('name') as FormControl;
  }

  get description() {
    return this.projectForm.get('description') as FormControl;
  }

  get type() {
    return this.projectForm.get('type') as FormControl;
  }

  get status() {
    return this.projectForm.get('status') as FormControl;
  }

  get assignedUsers() {
    return this.projectForm.get('assignedUsers') as FormControl;
  }

  updateProject() {
    const value = this.projectForm.value;
    const request = this.editMode ?
      this.projectService.putProject(value, this.data.projectId) :
      this.projectService.postProject(value);

    request.pipe(take(1))
      .subscribe(() => {
        this.projectDialogRef.close('updated');
        this.snackbar.open(`Projekt erfolgreich aktualisiert!`);
      }, err => {
        this.snackbar.open(`Projekt konnte nicht aktualisiert werden: ${err.message}`);
      });
  }

  deleteProject() {
    const dialogRef = this.delConfirmDialog.open(ConfirmationDialogComponent, {
      width: '500px',
      id: 'confirm-dialog',
      data: { message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.projectService.deleteProject(this.data.projectId)
          .pipe(take(1))
          .subscribe(() => {
            this.projectDialogRef.close('deleted');
            this.snackbar.open(`Projekt "${this.name.value}" erfolgreich gelöscht!`, 'OK');
          }, err => {
            this.snackbar.open(`Ticket "${this.name.value}" konnte nicht gelöscht werden: ${err.message}`, 'OK');
          });
      }
    });
  }

  resetProject() {
    this.projectForm.reset();
    this.projectForm.patchValue(this.initialProject);
  }

}
