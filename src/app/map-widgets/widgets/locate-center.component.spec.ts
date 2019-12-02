import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocateCenterComponent } from './locate-center.component';

describe('LocateCenterComponent', () => {
  let component: LocateCenterComponent;
  let fixture: ComponentFixture<LocateCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocateCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocateCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
