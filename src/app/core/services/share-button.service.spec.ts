import { TestBed } from '@angular/core/testing';

import { ShareButtonService } from './share-button.service';

describe('ShareButtonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareButtonService = TestBed.get(ShareButtonService);
    expect(service).toBeTruthy();
  });
});
