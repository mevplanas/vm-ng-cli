import { TestBed } from '@angular/core/testing';

import { WaistLayersService } from './waist-layers.service';

describe('WaistLayersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WaistLayersService = TestBed.get(WaistLayersService);
    expect(service).toBeTruthy();
  });
});
