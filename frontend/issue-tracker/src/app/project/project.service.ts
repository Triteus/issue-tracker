import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


interface UserPayload {
  project: Project;
  message: string;
}

export type MinimizedProject = Project & {numTickets: number};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  url = environment.baseUrl + '/v2/project';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<MinimizedProject[]> {
    return this.http.get<{ projects: MinimizedProject[] }>(this.url).pipe(
      map(res => res.projects)
    );
  }

  getProject(projectId: string): Observable<Project> {
    return this.http.get<{ project: Project, message: string }>(this.url + '/' + projectId).pipe(
      map(res => res.project)
    );
  }

  getProjectName(projectId: string): Observable<string> {
    return this.http.get<{ projectName: string }>(this.url + '/' + projectId + '/name')
      .pipe(
        map(res => {
          return res.projectName;
        })
      );
  }

  getAssignedUsers(projectId: string): Observable<string[]> {
    return this.http.get<{ assignedUsers: string[] }>(this.url + '/' + projectId + '/assignedUsers')
      .pipe(
        map(res => {
          return res.assignedUsers;
        })
      );
  }

  postProject(projectPayload: object): Observable<UserPayload> {
    return this.http.post<UserPayload>(this.url, projectPayload);
  }

  putProject(projectPayload: object, projectId: string): Observable<UserPayload> {
    return this.http.put<UserPayload>(this.url + '/' + projectId, projectPayload);
  }

  deleteProject(projectId: string): Observable<UserPayload> {
    return this.http.delete<UserPayload>(this.url + '/' + projectId);
  }

  patchAssignedUsers(userIds: string[], projectId: string): Observable<UserPayload> {
    return this.http.patch<UserPayload>(this.url + '/' + projectId + '/assignedUsers', {assignedUsers: userIds});
  }
}
