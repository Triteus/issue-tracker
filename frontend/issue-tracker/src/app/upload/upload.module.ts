import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload/upload.component';
import { MatButtonModule, MatDialogModule, MatListModule, MatProgressBarModule, MatIconModule, MatCardModule, MatRippleModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadListItemComponent } from './upload/upload-list-item/upload-list-item.component';



@NgModule({
  declarations: [UploadComponent, UploadListItemComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    MatRippleModule
  ],
  exports: [UploadComponent]
})
export class UploadModule { }
