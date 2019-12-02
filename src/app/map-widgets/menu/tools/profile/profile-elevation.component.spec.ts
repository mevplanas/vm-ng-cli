import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileElevationComponent } from './profile-elevation.component';

describe('ProfileElevationComponent', () => {
  let component: ProfileElevationComponent;
  let fixture: ComponentFixture<ProfileElevationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileElevationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileElevationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
