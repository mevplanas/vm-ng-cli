import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuThemesComponent } from './menu-themes.component';

describe('MenuThemesComponent', () => {
  let component: MenuThemesComponent;
  let fixture: ComponentFixture<MenuThemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuThemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
