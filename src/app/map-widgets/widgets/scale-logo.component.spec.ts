import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleLogoComponent } from './scale-logo.component';

describe('ScaleLogoComponent', () => {
  let component: ScaleLogoComponent;
  let fixture: ComponentFixture<ScaleLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScaleLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
