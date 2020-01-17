import { Component, AfterViewInit, OnDestroy, Input, Renderer2, ViewEncapsulation } from '@angular/core';

import * as baguetteBox from 'baguettebox.js';

@Component({
  selector: 'maps-v-gallery-view',
  template: `
    <!--Fake Gallery DOM -->
    <div id="gallery-ng-projects" class="gallery">
      <div class="gallery-item" *ngFor="let item of gallery">
        <a [href]="item.image">
            <img [src]="item.thumbnail" alt="Investiciniai projektai">
        </a>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./gallery-view.component.scss']
})
export class GalleryViewComponent implements AfterViewInit, OnDestroy {
  @Input() gallery: any;

  constructor(private rend: Renderer2) { }

  ngAfterViewInit() {
    baguetteBox.run('.gallery');
    console.log(this.gallery);

    // append Gallery to popup
    setTimeout(() => {
      const container = document.getElementsByClassName('esri-feature__main-container');
      const gallery = document.getElementById('gallery-ng-projects');
      // const loader = document.getElementById('gallery-loader');
      if ((gallery !== null && container.length > 0)) {
        // this.rend.setStyle(loader, 'display', 'none');
        this.rend.appendChild(container[0], gallery);
      }
    }, 1000);
  }

  ngOnDestroy() {
    baguetteBox.destroy();
  }
}

