import { TestBed } from '@angular/core/testing';

import { ThemeNameService } from './theme-name.service';

describe('ThemeNameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThemeNameService = TestBed.get(ThemeNameService);
    expect(service).toBeTruthy();
  });
});
