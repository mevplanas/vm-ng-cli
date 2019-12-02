import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeToolComponent } from './swipe-tool.component';

describe('SwipeToolComponent', () => {
  let component: SwipeToolComponent;
  let fixture: ComponentFixture<SwipeToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
