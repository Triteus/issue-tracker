import { TestBed } from '@angular/core/testing';

import { ParamTrackerService } from './param-tracker.service';

describe('ParamTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParamTrackerService = TestBed.get(ParamTrackerService);
    expect(service).toBeTruthy();
  });
});
