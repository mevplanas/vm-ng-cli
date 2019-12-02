import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSubLayersComponent } from './menu-sub-layers.component';

describe('MenuSubLayersComponent', () => {
  let component: MenuSubLayersComponent;
  let fixture: ComponentFixture<MenuSubLayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSubLayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSubLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
