import { TestBed } from '@angular/core/testing';

import { ProjectsFilterService } from './projects-filter.service';

describe('ProjectsFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectsFilterService = TestBed.get(ProjectsFilterService);
    expect(service).toBeTruthy();
  });
});
