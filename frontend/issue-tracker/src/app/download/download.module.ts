import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadComponent } from './download.component';
import { MatListModule, MatButtonModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { DownloadListItemComponent } from './download-list-item/download-list-item.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilenamePipe } from './filename.pipe';



@NgModule({
  declarations: [DownloadComponent, DownloadListItemComponent, FilenamePipe],
  imports: [
    CommonModule,
    MatListModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatProgressBarModule,

  ],
  exports: [
    DownloadComponent
  ]
})
export class DownloadModule { }
