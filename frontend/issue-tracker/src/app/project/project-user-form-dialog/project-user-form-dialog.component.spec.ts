import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUserFormDialogComponent } from './project-user-form-dialog.component';

describe('ProjectUserFormDialogComponent', () => {
  let component: ProjectUserFormDialogComponent;
  let fixture: ComponentFixture<ProjectUserFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectUserFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectUserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
