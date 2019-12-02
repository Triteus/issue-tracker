import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UploadService } from '../upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [UploadService]
})
export class UploadComponent implements OnInit, OnDestroy {

  @ViewChild('file', { static: false }) file;
  public files: Set<File> = new Set();

  uploading = false;
  @Output() isUploading = new EventEmitter<boolean>(this.uploading);
  @Output() uploadedFilenames = new EventEmitter<string[]>();

  uploadSuccessful = false;

  uploadCompletedSub: Subscription;

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
    this.uploadCompletedSub = this.uploadService.allUploadsCompleted$()
      .subscribe((filenames) => {
        // the component is no longer uploading
        console.log(filenames);
        this.uploading = false;
        this.isUploading.emit(false);
        this.uploadedFilenames.emit(filenames);
      });

    this.uploadService.uploadStarted$().subscribe(() => {
      this.uploading = true;
      this.isUploading.emit(true);
    });
  }

  ngOnDestroy() {
    this.uploadCompletedSub.unsubscribe();
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: FileList = this.file.nativeElement.files;
    for (let i = 0; i < files.length; i++) {
      this.files.add(files.item(i));
    }
  }

  deleteFile(file: File) {
    this.files.delete(file);
  }

}
