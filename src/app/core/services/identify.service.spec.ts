import { TestBed } from '@angular/core/testing';

import { IdentifyService } from './identify.service';

describe('IdentifyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdentifyService = TestBed.get(IdentifyService);
    expect(service).toBeTruthy();
  });
});
