import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureMapComponent } from './measure-map.component';

describe('MeasureMapComponent', () => {
  let component: MeasureMapComponent;
  let fixture: ComponentFixture<MeasureMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
