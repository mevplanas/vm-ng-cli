import { TestBed } from '@angular/core/testing';

import { MeasureMapService } from './measure-map.service';

describe('MeasureMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeasureMapService = TestBed.get(MeasureMapService);
    expect(service).toBeTruthy();
  });
});
