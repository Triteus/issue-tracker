import { TestBed } from '@angular/core/testing';

import { TicketTrackerService } from './ticket-tracker.service';

describe('TicketTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketTrackerService = TestBed.get(TicketTrackerService);
    expect(service).toBeTruthy();
  });
});
