import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectUserFormDialogComponent } from '../project-user-form-dialog/project-user-form-dialog.component';
import { ProjectTrackerService } from 'src/app/shared/services/project-tracker.service';

@Component({
  selector: 'app-project-user-form-dialog-entry',
  templateUrl: './project-user-form-dialog-entry.component.html',
  styleUrls: ['./project-user-form-dialog-entry.component.scss']
})
export class ProjectUserFormDialogEntryComponent implements OnInit, OnDestroy {


  dialogSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private projectTrackerService: ProjectTrackerService
  ) {
    this.openDialog();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.dialogSub.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProjectUserFormDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
    });
    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted' || result === 'updated') {
        this.router.navigate(['../'],
          {
            queryParams: { reset: true },
            relativeTo: this.route
          }
        );
      } else {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    });
  }

}
