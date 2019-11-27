import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketFormDialogComponent } from './ticket-form-dialog.component';

describe('TicketFormDialogComponent', () => {
  let component: TicketFormDialogComponent;
  let fixture: ComponentFixture<TicketFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
