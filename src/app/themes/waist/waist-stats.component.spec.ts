import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaistStatsComponent } from './waist-stats.component';

describe('WaistStatsComponent', () => {
  let component: WaistStatsComponent;
  let fixture: ComponentFixture<WaistStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaistStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaistStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
