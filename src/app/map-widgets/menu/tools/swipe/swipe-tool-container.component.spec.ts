import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeToolContainerComponent } from './swipe-tool-container.component';

describe('SwipeToolContainerComponent', () => {
  let component: SwipeToolContainerComponent;
  let fixture: ComponentFixture<SwipeToolContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeToolContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeToolContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
