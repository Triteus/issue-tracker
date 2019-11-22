import { TestBed } from '@angular/core/testing';

import { TicketBoardService } from './ticket-board.service';

describe('TicketBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketBoardService = TestBed.get(TicketBoardService);
    expect(service).toBeTruthy();
  });
});
