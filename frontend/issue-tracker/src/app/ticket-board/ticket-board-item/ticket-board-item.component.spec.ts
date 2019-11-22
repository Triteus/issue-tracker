import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketBoardItemComponent } from './ticket-board-item.component';

describe('TicketBoardItemComponent', () => {
  let component: TicketBoardItemComponent;
  let fixture: ComponentFixture<TicketBoardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketBoardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketBoardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
