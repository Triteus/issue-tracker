import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType, HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { Observable, Subject, Subscription, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';


export interface ProgressPayload {
  progress: number;
  error: boolean;
  isCompleted: boolean;
  filename?: string;
}

@Injectable()
export class UploadService implements OnDestroy {

  private url = 'http://localhost:3000/api/file';

  private uploadStartedSubject = new Subject<void>();
  private uploadChanged = new BehaviorSubject<boolean>(true);
  private progress: { [key: string]: Observable<ProgressPayload> } = {};
  private progressSubs: { [key: string]: Subscription } = {};

  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    this.unsubAll();
  }

  uploadStarted$() {
    return this.uploadStartedSubject.asObservable();
  }

  progress$(filename: string) {
    return this.progress[filename];
  }

  hasProgress(filename: string) {
    return Boolean(this.progress[filename]);
  }

  public uploadFile(file: File): { key: string, progress$: Observable<ProgressPayload> } {
    // create a new multipart-form for every file
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    // create a http-post request and pass the form
    // tell it to report the upload progress
    const req = new HttpRequest('POST', this.url, formData, {
      reportProgress: true,
    });

    // create a new progress-subject for every file
    // NOTE:  behavior-subject will never be completed, so that the final progress stays available
    //        to the outside upon subscribing
    const progress = new BehaviorSubject<ProgressPayload>({ progress: 0, error: false, isCompleted: false });
    this.progress[file.name] = progress.asObservable();
    this.uploadChanged.next(true);
    this.uploadStartedSubject.next();

    // send the http-request and subscribe for progress-updates
    const sub = this.http.request<{ filename: string, message: string }>(req).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
        // calculate the progress percentage
        const percentDone = Math.round(100 * event.loaded / event.total);
        // pass the percentage into the progress-stream
        progress.next({ progress: percentDone, error: false, isCompleted: false });
      } else if (event instanceof HttpErrorResponse ||
        (event instanceof HttpHeaderResponse && !event.ok) ||
        (event instanceof HttpResponse && !event.ok)) {
        // indicate that upload was not successful
        progress.next({ progress: 0, error: true, isCompleted: true });
      } else if (event instanceof HttpResponse) {
        // The upload is complete
        progress.next({ progress: 100, error: false, isCompleted: true, filename: event.body.filename });
      }
    });

    // save subscription so we can unsubscribe later
    this.progressSubs[file.name] = sub;

    return {
      key: file.name,
      progress$: progress.asObservable()
    };
  }

  uploadFiles(files: File[]) {
    for (const file of files) {
      this.uploadFile(file);
    }
    return this.progress;
  }

  /**
   * Returns an observable including all uploaded files
   * Observable emits value, if:
   *  1) all uploads are completed (no matter if successful or not)
   */

  allUploadsCompleted$(): Observable<string[]> {
    /**
     * Combine all the latest values from progress-observables.
     * upload-service uses behavior-subject, which means observables belonging to successfully uploaded
     * files emit latest value upon subscribing
     */
    return this.uploadChanged.asObservable().pipe(
      switchMap(() => {
        const progressSubjects = Object.values(this.progress);
        if (progressSubjects.length === 0) {
          return of([]);
        }
        return combineLatest(progressSubjects).pipe(
          // only pass if all uploads are completed or there are no uploads
          filter(progressArr => progressArr.every(prog => prog.isCompleted)),
          // filter out completed uploads in which an error occured
          map(progressArr => progressArr.filter(prog => !prog.error)),
          // map to value that indicates whether all uploads are completed
          map((progressArr) => progressArr.map(prog => prog.filename)),
        );
      })
    );
  }

  stopUpload(file: File) {
    delete this.progress[file.name];
    // make sure to unsubscribe from progress sub
    this.unsubProgress(file.name);
    this.uploadChanged.next(true);
  }

  unsubProgress(filename: string) {
    if (this.progressSubs[filename]) {
      this.progressSubs[filename].unsubscribe();
    }
  }

  unsubAll() {
    Object.values(this.progressSubs).forEach(sub => sub.unsubscribe());
  }
}
