import { TestBed } from '@angular/core/testing';

import { MapWidgetsService } from './map-widgets.service';

describe('MapWidgetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapWidgetsService = TestBed.get(MapWidgetsService);
    expect(service).toBeTruthy();
  });
});
