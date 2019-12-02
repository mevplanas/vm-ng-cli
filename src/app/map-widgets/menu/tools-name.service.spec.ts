import { TestBed } from '@angular/core/testing';

import { ToolsNameService } from './tools-name.service';

describe('ToolsNameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolsNameService = TestBed.get(ToolsNameService);
    expect(service).toBeTruthy();
  });
});
