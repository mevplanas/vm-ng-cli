import { TestBed } from '@angular/core/testing';

import { BuildingsTooltipService } from './buildings-tooltip.service';

describe('BuildingsTooltipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuildingsTooltipService = TestBed.get(BuildingsTooltipService);
    expect(service).toBeTruthy();
  });
});
