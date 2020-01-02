import { TestBed } from '@angular/core/testing';

import { KindergartensLayersService } from './kindergartens-layers.service';

describe('KindergartensLayersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KindergartensLayersService = TestBed.get(KindergartensLayersService);
    expect(service).toBeTruthy();
  });
});
