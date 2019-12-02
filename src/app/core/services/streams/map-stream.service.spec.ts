import { TestBed } from '@angular/core/testing';

import { MapStreamService } from './map-stream.service';

describe('MapStreamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapStreamService = TestBed.get(MapStreamService);
    expect(service).toBeTruthy();
  });
});
