import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DownloadService } from './download.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  providers: [DownloadService]
})
export class DownloadComponent implements OnInit {

  // holds array of existing filenames
  @Input() filenamesControl: FormControl;

  // filenames passed to this input cannot be removed
  @Input() readOnlyFilenames: string[];
  readOnly = false;

  constructor() { }

  ngOnInit() {
    if (!this.filenamesControl) {
      // set to download-only mode (user cannot remove file)
      this.filenamesControl = new FormControl(this.readOnlyFilenames || []);
      this.readOnly = true;
    }
  }

  get filenames() {
    return this.filenamesControl.value;
  }

  removeFile(removedFilename: string) {
    const filenames = this.filenamesControl.value.filter((filename: string) => filename !== removedFilename);
    this.filenamesControl.setValue(filenames);
  }

}
