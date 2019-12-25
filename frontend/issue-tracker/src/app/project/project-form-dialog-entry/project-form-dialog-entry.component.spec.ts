import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFormDialogEntryComponent } from './project-form-dialog-entry.component';

describe('ProjectFormDialogEntryComponent', () => {
  let component: ProjectFormDialogEntryComponent;
  let fixture: ComponentFixture<ProjectFormDialogEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFormDialogEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFormDialogEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
