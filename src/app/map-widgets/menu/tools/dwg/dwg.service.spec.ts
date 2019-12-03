import { TestBed } from '@angular/core/testing';

import { DwgService } from './dwg.service';

describe('DwgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DwgService = TestBed.get(DwgService);
    expect(service).toBeTruthy();
  });
});
