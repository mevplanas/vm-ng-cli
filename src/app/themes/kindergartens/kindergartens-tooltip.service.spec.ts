import { TestBed } from '@angular/core/testing';

import { KindergartensTooltipService } from './kindergartens-tooltip.service';

describe('KindergartensTooltipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KindergartensTooltipService = TestBed.get(KindergartensTooltipService);
    expect(service).toBeTruthy();
  });
});
