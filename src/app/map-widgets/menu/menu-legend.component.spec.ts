import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLegendComponent } from './menu-legend.component';

describe('MenuLegendComponent', () => {
  let component: MenuLegendComponent;
  let fixture: ComponentFixture<MenuLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
