import { TestBed } from '@angular/core/testing';

import { FeatureQueryService } from './feature-query.service';

describe('FeatureQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeatureQueryService = TestBed.get(FeatureQueryService);
    expect(service).toBeTruthy();
  });
});
