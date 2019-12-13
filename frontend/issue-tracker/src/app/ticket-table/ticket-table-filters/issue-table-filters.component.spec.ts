import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTableFiltersComponent } from './issue-table-filters.component';

describe('IssueTableFiltersComponent', () => {
  let component: IssueTableFiltersComponent;
  let fixture: ComponentFixture<IssueTableFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueTableFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueTableFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
