import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasemapToggleComponent } from './basemap-toggle.component';

describe('BasemapToggleComponent', () => {
  let component: BasemapToggleComponent;
  let fixture: ComponentFixture<BasemapToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasemapToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasemapToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
