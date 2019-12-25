import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectTrackerService } from '../../shared/services/project-tracker.service';


/**
 * Component that takes care of initializing project-tracker-service
 */

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

  projectId: string;
  projectName: string;

  paramSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private projectTrackerService: ProjectTrackerService
    ) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId');

    this.paramSub = this.route.paramMap.subscribe(paramMap => {
      this.projectId = paramMap.get('projectId');
    });

  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }

}
