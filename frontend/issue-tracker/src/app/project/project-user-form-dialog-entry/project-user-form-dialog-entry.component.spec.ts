import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUserFormDialogEntryComponent } from './project-user-form-dialog-entry.component';

describe('ProjectUserFormDialogEntryComponent', () => {
  let component: ProjectUserFormDialogEntryComponent;
  let fixture: ComponentFixture<ProjectUserFormDialogEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectUserFormDialogEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectUserFormDialogEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
