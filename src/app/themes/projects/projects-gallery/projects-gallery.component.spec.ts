import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsGalleryComponent } from './projects-gallery.component';

describe('ProjectsGalleryComponent', () => {
  let component: ProjectsGalleryComponent;
  let fixture: ComponentFixture<ProjectsGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
