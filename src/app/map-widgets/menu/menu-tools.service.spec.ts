import { TestBed } from '@angular/core/testing';

import { MenuToolsService } from './menu-tools.service';

describe('MenuToolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuToolsService = TestBed.get(MenuToolsService);
    expect(service).toBeTruthy();
  });
});
