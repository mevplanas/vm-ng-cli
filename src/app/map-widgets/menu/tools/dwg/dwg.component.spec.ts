import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwgComponent } from './dwg.component';

describe('DwgComponent', () => {
  let component: DwgComponent;
  let fixture: ComponentFixture<DwgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
