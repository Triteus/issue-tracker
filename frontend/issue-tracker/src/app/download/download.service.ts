import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { HttpClient, HttpRequest, HttpEventType, HttpErrorResponse, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import * as contentDisposition from 'content-disposition';
import { saveAs } from 'file-saver';
import { FilenamePipe } from './filename.pipe';

// https://stackoverflow.com/questions/35138424/how-do-i-download-a-file-with-angular2


export interface DownloadProgressPayload {
  progress: number;
  loaded?: number;
  total?: number;
  error?: boolean;
  isCompleted: boolean;
  stopped?: boolean;
}

@Injectable()
export class DownloadService implements OnDestroy {

  private url = 'http://localhost:3000/api/file';

  private downloadStartedSubject = new Subject<void>();
  private downloadChangedSubject = new BehaviorSubject<boolean>(true);
  private progressSubjects: { [key: string]: BehaviorSubject<DownloadProgressPayload> } = {};
  private progressSubs: { [key: string]: Subscription } = {};

  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    this.unsubAll();
  }

  downloadStarted$() {
    return this.downloadStartedSubject.asObservable();
  }

  progress$(filename: string) {
    if (!this.hasProgress(filename)) {
      throw new Error(`[DownloadService] No progress-observable for file "${filename}"found!
      Make sure that observable exists before subscribing to it by using "hasProgress(filename)".`);
    }
    return this.progressSubjects[filename].asObservable();
  }

  hasProgress(filename: string) {
    return Boolean(this.progressSubjects[filename]);
  }

  public downloadFile(filePath: string): { key: string, progress$: Observable<DownloadProgressPayload> } {

    // create a http-GET request
    // tell it to report the download progress

    const req = new HttpRequest('GET', this.url + '/' + filePath, {
      reportProgress: true,
      responseType: 'blob',
    });

    // create a new progress-subject for every file
    // NOTE:  behavior-subject will never be completed, so that the final progress stays available
    //        to the outside upon subscribing
    const progressSubject = new BehaviorSubject<DownloadProgressPayload>({ progress: 0, error: false, isCompleted: false });
    this.progressSubjects[filePath] = progressSubject;
    this.downloadChangedSubject.next(true);
    this.downloadStartedSubject.next();

    // send the http-request and subscribe for progress-updates
    const sub = this.http.request<Blob>(req).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
        // calculate the progress percentage
        const percentDone = Math.round(100 * event.loaded / event.total);
        // pass the percentage into the progress-stream
        progressSubject.next({ progress: percentDone, loaded: event.loaded, total: event.total, error: false, isCompleted: false });
      } else if (event instanceof HttpErrorResponse ||
        (event instanceof HttpHeaderResponse && !event.ok) ||
        (event instanceof HttpResponse && !event.ok)) {
        // indicate that download was not successful
        progressSubject.next({ progress: 0, error: true, isCompleted: true });
      } else if (event instanceof HttpResponse) {
        // The download is complete
        const filename = contentDisposition.parse(event.headers.get('Content-Disposition')).parameters.filename;
        // save downloaded blob, shorten filename with pipe
        saveAs(event.body, new FilenamePipe().transform(filename));
        progressSubject.next({ progress: 100, error: false, isCompleted: true });
      }
    });

    // save subscription so we can unsubscribe later
    this.progressSubs[filePath] = sub;

    return {
      key: filePath,
      progress$: progressSubject.asObservable()
    };
  }


  stopDownload(filePath: string) {
    // inform observers that
    this.progressSubjects[filePath].next({progress: 0, error: false, isCompleted: false, stopped: true});
    this.deleteDownloadProgress(filePath);
  }

  deleteDownloadProgress(filePath: string) {
    delete this.progressSubjects[filePath];
    // make sure to unsubscribe from progress sub
    this.unsubProgressObservable(filePath);
    this.downloadChangedSubject.next(true);
  }

  unsubProgressObservable(filename: string) {
    if (this.progressSubs[filename]) {
      this.progressSubs[filename].unsubscribe();
    }
  }

  unsubAll() {
    Object.values(this.progressSubs).forEach(sub => sub.unsubscribe());
  }

}
