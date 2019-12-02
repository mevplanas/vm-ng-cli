import { TestBed } from '@angular/core/testing';

import { BasemapsService } from './basemaps.service';

describe('BasemapsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasemapsService = TestBed.get(BasemapsService);
    expect(service).toBeTruthy();
  });
});
