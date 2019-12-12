import { Component, OnInit, Input, Output, EventEmitter, ɵbypassSanitizationTrustResourceUrl, OnDestroy } from '@angular/core';
import { DownloadService } from '../download.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-download-list-item',
  templateUrl: './download-list-item.component.html',
  styleUrls: ['./download-list-item.component.scss']
})
export class DownloadListItemComponent implements OnInit, OnDestroy {

  @Input() filename: string;
  @Input() readOnly: boolean;
  @Output() fileRemoved = new EventEmitter<string>();

  downloaded = false;
  saveBtnVisible = true;

  progressSub: Subscription;

  constructor(private downloadService: DownloadService) { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.progressSub) {
      this.progressSub.unsubscribe();
    }
  }

  removeFile() {
    this.fileRemoved.emit(this.filename);
  }

  progress$() {
    return this.downloadService.progress$(this.filename);
  }

  hasProgress() {
    return this.downloadService.hasProgress(this.filename);
  }

  downloadFile() {
    // start the upload
    this.downloadService.downloadFile(this.filename);

    this.saveBtnVisible = false;
    if (this.progressSub) {
      this.progressSub.unsubscribe();
    }
    this.progress$().subscribe((progress) => {
      if (progress.isCompleted || progress.stopped) {
        this.saveBtnVisible = true;
      } else {
        this.saveBtnVisible = false;
      }
    });
  }

  stopDownload() {
    this.downloadService.stopDownload(this.filename);
  }

}
