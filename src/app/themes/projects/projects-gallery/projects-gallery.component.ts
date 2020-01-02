import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectsListService } from '../projects-list/projects-list.service';

@Component({
  selector: 'maps-v-projects-gallery',
  template: `
    <maps-v-gallery-view *ngIf="gallery.length > 0" [gallery]="gallery"></maps-v-gallery-view>
  `,
  encapsulation: ViewEncapsulation.None
})
export class ProjectsGalleryComponent implements OnInit, OnDestroy {
  gallery = [];
  subscription: Subscription;

  constructor(private projectsListService: ProjectsListService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscription = this.projectsListService.galleryArr.subscribe((imgGallery) => {
      // set to emtpy array and destroy child gallery
      this.gallery = [];
      this.cdr.detectChanges();

      setTimeout(() => {
        this.gallery = imgGallery;
        this.cdr.detectChanges();
      }, 600);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
