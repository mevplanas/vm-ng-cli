import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileToolContainerComponent } from './profile-tool-container.component';

describe('ProfileToolContainerComponent', () => {
  let component: ProfileToolContainerComponent;
  let fixture: ComponentFixture<ProfileToolContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileToolContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileToolContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
