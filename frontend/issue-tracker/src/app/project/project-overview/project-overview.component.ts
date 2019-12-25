import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from '../project.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit, OnDestroy {

  projectId: string;
  project$: Observable<Project>;

  paramSub: Subscription;

  constructor(private projectService: ProjectService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.projectId = this.route.parent.snapshot.paramMap.get('projectId');
    this.paramSub = this.route.parent.paramMap.subscribe((paramMap) => {
      this.projectId = paramMap.get('projectId');
    });
    this.project$ = this.projectService.getProject(this.projectId);
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }

}
