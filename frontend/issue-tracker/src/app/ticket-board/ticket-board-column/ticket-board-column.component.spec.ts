import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketBoardColumnComponent } from './ticket-board-column.component';

describe('TicketBoardColumnComponent', () => {
  let component: TicketBoardColumnComponent;
  let fixture: ComponentFixture<TicketBoardColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketBoardColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketBoardColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
