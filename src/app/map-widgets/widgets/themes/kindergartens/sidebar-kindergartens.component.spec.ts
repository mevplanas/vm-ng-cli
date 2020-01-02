import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarKindergartensComponent } from './sidebar-kindergartens.component';

describe('SidebarKindergartensComponent', () => {
  let component: SidebarKindergartensComponent;
  let fixture: ComponentFixture<SidebarKindergartensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarKindergartensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarKindergartensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
