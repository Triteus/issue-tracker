import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadListItemComponent } from './upload-list-item.component';

describe('UploadListItemComponent', () => {
  let component: UploadListItemComponent;
  let fixture: ComponentFixture<UploadListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
