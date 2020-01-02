import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLegendProjectsComponent } from './menu-legend-projects.component';

describe('MenuLegendProjectsComponent', () => {
  let component: MenuLegendProjectsComponent;
  let fixture: ComponentFixture<MenuLegendProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuLegendProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLegendProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
