import { TestBed } from '@angular/core/testing';

import { ProjectTrackerService } from './project-tracker.service';

describe('ProjectTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectTrackerService = TestBed.get(ProjectTrackerService);
    expect(service).toBeTruthy();
  });
});
