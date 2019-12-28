import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketFormDialogComponent } from 'src/app/ticket-form/ticket-form-dialog/ticket-form-dialog.component';
import { ProjectFormDialogComponent } from '../project-form-dialog/project-form-dialog.component';
import { ProjectTrackerService } from 'src/app/shared/services/project-tracker.service';
import { ParamTrackerService } from 'src/app/param-tracker.service';

@Component({
  selector: 'app-project-form-dialog-entry',
  templateUrl: './project-form-dialog-entry.component.html',
  styleUrls: ['./project-form-dialog-entry.component.scss']
})
export class ProjectFormDialogEntryComponent implements OnInit, OnDestroy {


  dialogSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private projectTrackerService: ProjectTrackerService,
  ) {
    this.openDialog();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.dialogSub.unsubscribe();
  }

  openDialog(): void {
    let projectId = '';
    if (this.route.snapshot.data.new) {
      projectId = 'new';
    } else {
      projectId = this.projectTrackerService.getSelectedObjectId();
    }

    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { projectId }
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
