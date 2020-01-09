import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSystemsInputComponent } from './ticket-systems-input.component';

describe('TicketSystemsInputComponent', () => {
  let component: TicketSystemsInputComponent;
  let fixture: ComponentFixture<TicketSystemsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketSystemsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSystemsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
