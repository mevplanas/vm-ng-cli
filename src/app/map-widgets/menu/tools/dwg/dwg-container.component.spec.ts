import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwgContainerComponent } from './dwg-container.component';

describe('DwgContainerComponent', () => {
  let component: DwgContainerComponent;
  let fixture: ComponentFixture<DwgContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwgContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwgContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
