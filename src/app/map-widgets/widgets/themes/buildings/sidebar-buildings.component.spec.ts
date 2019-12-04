import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarBuildingsComponent } from './sidebar-buildings.component';

describe('SidebarBuildingsComponent', () => {
  let component: SidebarBuildingsComponent;
  let fixture: ComponentFixture<SidebarBuildingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarBuildingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarBuildingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
