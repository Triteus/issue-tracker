import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadService } from '../../upload.service';

@Component({
  selector: 'app-upload-list-item',
  templateUrl: './upload-list-item.component.html',
  styleUrls: ['./upload-list-item.component.scss']
})
export class UploadListItemComponent implements OnInit {

  @Input() file: File;
  @Output() fileDeleted = new EventEmitter<void>();

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
    this.uploadFile();
  }

  progress$() {
    return this.uploadService.progress$(this.file.name);
  }

  hasProgress() {
    return this.uploadService.hasProgress(this.file.name);
  }

  uploadFile() {
    // start the upload
    this.uploadService.uploadFile(this.file);
  }

  stopUpload() {
    this.uploadService.stopUpload(this.file);
  }

  deleteFile() {
    // NOTE: Files do not get deleted from server yet
    this.uploadService.stopUpload(this.file);
    this.fileDeleted.emit();
  }

}
