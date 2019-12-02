import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLayersComponent } from './menu-layers.component';

describe('MenuLayersComponent', () => {
  let component: MenuLayersComponent;
  let fixture: ComponentFixture<MenuLayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuLayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
