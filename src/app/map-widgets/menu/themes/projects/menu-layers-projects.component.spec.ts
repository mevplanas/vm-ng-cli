import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLayersProjectsComponent } from './menu-layers-projects.component';

describe('MenuLayersProjectsComponent', () => {
  let component: MenuLayersProjectsComponent;
  let fixture: ComponentFixture<MenuLayersProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuLayersProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLayersProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
