import { TestBed } from '@angular/core/testing';

import { PointAddRemoveService } from './point-add-remove.service';

describe('PointAddRemoveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PointAddRemoveService = TestBed.get(PointAddRemoveService);
    expect(service).toBeTruthy();
  });
});
