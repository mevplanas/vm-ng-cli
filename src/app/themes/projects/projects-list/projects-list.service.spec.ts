import { TestBed } from '@angular/core/testing';

import { ProjectsListService } from './projects-list.service';

describe('ProjectsListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectsListService = TestBed.get(ProjectsListService);
    expect(service).toBeTruthy();
  });
});
