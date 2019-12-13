import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketFormDialogEntryComponent } from './ticket-form-dialog-entry.component';

describe('TicketFormDialogEntryComponent', () => {
  let component: TicketFormDialogEntryComponent;
  let fixture: ComponentFixture<TicketFormDialogEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketFormDialogEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFormDialogEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
