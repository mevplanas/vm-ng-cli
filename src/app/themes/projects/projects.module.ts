import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from '../../shared.module';
import { ProjectsComponent } from './projects.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsGalleryComponent } from './projects-gallery/projects-gallery.component';
import { GalleryViewComponent } from './projects-gallery/gallery-view.component';
import { TextHighlightPipe } from './pipes/text-highlight.pipe';
import { ProjectsListService, ProjectsFilterService, FeatureQueryService, PointAddRemoveService } from '.';

@NgModule({
  declarations: [ProjectsComponent, ProjectsListComponent, ProjectsGalleryComponent, GalleryViewComponent, TextHighlightPipe],
  providers: [ ProjectsListService, ProjectsFilterService, FeatureQueryService, PointAddRemoveService ],
  imports: [
    CommonModule,
    SharedModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
