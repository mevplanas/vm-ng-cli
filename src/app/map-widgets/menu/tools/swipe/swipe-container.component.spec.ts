import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeContainerComponent } from './swipe-container.component';

describe('SwipeContainerComponent', () => {
  let component: SwipeContainerComponent;
  let fixture: ComponentFixture<SwipeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
