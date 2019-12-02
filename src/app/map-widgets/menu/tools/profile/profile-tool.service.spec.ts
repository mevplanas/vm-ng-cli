import { TestBed } from '@angular/core/testing';

import { ProfileToolService } from './profile-tool.service';

describe('ProfileToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileToolService = TestBed.get(ProfileToolService);
    expect(service).toBeTruthy();
  });
});
