import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityIconComponent } from './priority-icon.component';

describe('PriorityIconComponent', () => {
  let component: PriorityIconComponent;
  let fixture: ComponentFixture<PriorityIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
