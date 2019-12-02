import { TestBed } from '@angular/core/testing';

import { SwipeToolService } from './swipe-tool.service';

describe('SwipeToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwipeToolService = TestBed.get(SwipeToolService);
    expect(service).toBeTruthy();
  });
});
