import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from '../project.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit, OnDestroy {

  projectId: string;
  project$: Observable<Project>;

  paramSub: Subscription;
  subs: Subscription[] = [];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private delConfirmDialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.projectId = this.route.parent.snapshot.paramMap.get('projectId');
    this.paramSub = this.route.parent.paramMap.subscribe((paramMap) => {
      this.projectId = paramMap.get('projectId');
    });
    this.project$ = this.projectService.getProject(this.projectId);

    this.subs.push(this.route.queryParamMap.subscribe((queryParamMap) => {
      // user deleted or updated ticket in dialog-component
      if (queryParamMap.get('reset')) {
        this.project$ = this.projectService.getProject(this.projectId);
      }
    }));

  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.paramSub.unsubscribe();
  }

  openUserFormDialog() {
    this.router.navigate(['assigned-users'], { relativeTo: this.route });
  }

  openProjectFormDialog() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteProject() {
    const dialogRef = this.delConfirmDialog.open(ConfirmationDialogComponent, {
      width: '500px',
      id: 'confirm-dialog',
      data: { message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.subs.push(this.projectService.deleteProject(this.projectId).pipe(take(1)).subscribe(() => {
          this.router.navigate(['projects']);
          this.snackbar.open('Projekt erfolgreich gelöscht!', 'OK');
        }));
      }
    });
  }

}
