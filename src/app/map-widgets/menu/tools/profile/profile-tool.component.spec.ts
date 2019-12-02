import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileToolComponent } from './profile-tool.component';

describe('ProfileToolComponent', () => {
  let component: ProfileToolComponent;
  let fixture: ComponentFixture<ProfileToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
