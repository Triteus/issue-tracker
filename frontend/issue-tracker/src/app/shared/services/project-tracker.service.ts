import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { Tracker } from 'src/app/models/tracker.model';
import { ProjectService } from '../../project/project.service';
import { take, switchMap, filter, tap } from 'rxjs/operators';
import { ParamTrackerService } from 'src/app/param-tracker.service';


@Injectable({
  providedIn: 'root'
})
export class ProjectTrackerService implements Tracker, OnDestroy {

  selectedProjectIdSubject = new BehaviorSubject<string | null>(null);
  selectedProjectNameSubject = new BehaviorSubject<string>('');
  subs: Subscription[] = [];

  constructor(private paramService: ParamTrackerService, private projectService: ProjectService) {
    this.subs.push(this.paramService.param$('projectId')
      .pipe(
        // do not go on if there is no id
        filter((id) => !!id),
        // get name of project
        switchMap((id) => this.projectService.getProjectName(id)))
      .subscribe((projectName) => {
        this.selectedProjectNameSubject.next(projectName);
      }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  selectedObjectId$() {
    return this.paramService.param$('projectId');
  }

  getSelectedObjectId() {
    return this.paramService.getParam('projectId');
  }

  selectedObjectName$() {
    return this.selectedProjectNameSubject.asObservable();
  }

  getSelectedObjectName() {
    return this.selectedProjectNameSubject.getValue();
  }

}
