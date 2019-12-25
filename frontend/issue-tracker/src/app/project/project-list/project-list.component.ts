import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from '../project.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {

  projects$: Observable<Project[]>;

  querySub: Subscription;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.projects$ = this.projectService.getProjects();

    this.querySub = this.route.queryParamMap.subscribe((queryParamMap) => {
      // user deleted or updated ticket in dialog-component
      if (queryParamMap.get('reset')) {
        this.router.navigate(['./'], {relativeTo: this.route})
          .then(() => {
            this.projects$ = this.projectService.getProjects();
          });
      }
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }

  openProjectDialog() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  openProjectDetails(id: string) {
    this.router.navigate([id], {relativeTo: this.route});
  }

}
