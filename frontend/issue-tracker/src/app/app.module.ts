import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule, MatSidenavModule, MatToolbar, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatSelectModule, MatDatepickerModule } from '@angular/material/';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { IssueTableComponent } from './issue-table/issue-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { IssueOverviewComponent } from './issue-overview/issue-overview.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { IssueTableFiltersComponent } from './issue-table-filters/issue-table-filters.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    IssueTableComponent,
    IssueOverviewComponent,
    IssueTableFiltersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSliderModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    LayoutModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
