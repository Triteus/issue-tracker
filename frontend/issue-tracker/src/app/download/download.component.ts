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

  constructor() { }

  ngOnInit() { }

  get filenames() {
    return this.filenamesControl.value;
  }

  removeFile(removedFilename: string) {
    const filenames = this.filenamesControl.value.filter((filename: string) => filename !== removedFilename);
    this.filenamesControl.setValue(filenames);
  }

}
