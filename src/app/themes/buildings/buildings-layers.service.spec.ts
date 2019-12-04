import { TestBed } from '@angular/core/testing';

import { BuildingsLayersService } from './buildings-layers.service';

describe('BuildingsLayersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuildingsLayersService = TestBed.get(BuildingsLayersService);
    expect(service).toBeTruthy();
  });
});
