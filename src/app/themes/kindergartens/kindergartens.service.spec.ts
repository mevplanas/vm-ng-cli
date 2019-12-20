import { TestBed } from '@angular/core/testing';

import { KindergartensService } from './kindergartens.service';

describe('KindergartensService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KindergartensService = TestBed.get(KindergartensService);
    expect(service).toBeTruthy();
  });
});
