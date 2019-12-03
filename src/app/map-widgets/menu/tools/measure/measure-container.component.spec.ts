import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureContainerComponent } from './measure-container.component';

describe('MeasureContainerComponent', () => {
  let component: MeasureContainerComponent;
  let fixture: ComponentFixture<MeasureContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
