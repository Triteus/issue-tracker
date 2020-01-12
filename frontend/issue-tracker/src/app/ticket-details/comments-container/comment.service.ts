import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectTrackerService } from 'src/app/shared/services/project-tracker.service';
import { TicketTrackerService } from 'src/app/shared/services/ticket-tracker.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { UserComment } from 'src/app/models/comment.model';
import { PaginationSortParams } from 'src/app/ticket-table/issue-table.component';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private http: HttpClient,
    private projectTrackerService: ProjectTrackerService,
    private ticketTrackerService: TicketTrackerService
    ) { }


    get url() {
        return `${environment.baseUrl}/v2/project/${this.projectTrackerService.getSelectedObjectId()}` +
        `/ticket/${this.ticketTrackerService.getSelectedObjectId()}/comment/`
    }

  getCommentsAndCount(params: PaginationSortParams): Observable<{comments: UserComment[], numComments: number}> {
    return this.http.get<{comments: UserComment[], numComments: number}>(this.url, {params: params as any});
  }

  getComment(commentId: string): Observable<UserComment> {
    return this.http.get<{comment: UserComment}>(this.url + commentId)
    .pipe(
      map(res => res.comment)
    )
  }

  addComment(message: string) {
    return this.http.post<{message: string, comment: UserComment}>(this.url, {message});
  }

  changeComment(commentId: string, message: string) {
    return this.http.put<{message: string, updatedComment: UserComment}>(this.url + commentId, {message});
  }

  deleteComment(commentId: string) {
    return this.http.delete<{message: string, deletedComment: UserComment}>(this.url + commentId);
  }



}
