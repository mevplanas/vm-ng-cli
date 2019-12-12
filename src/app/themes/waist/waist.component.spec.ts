import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaistComponent } from './waist.component';

describe('WaistComponent', () => {
  let component: WaistComponent;
  let fixture: ComponentFixture<WaistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
