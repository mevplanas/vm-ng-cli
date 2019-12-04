import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';

import watchUtils from 'arcgis-js-api/core/watchUtils';

import { MapService } from '../../services/map.service';
import { ViewService } from '../../services/view.service';
import { MapStreamService } from '../../services/streams/map-stream.service';
import { BasemapsService } from '../../services/widgets/basemaps.service';
import { ShareButtonService } from '../../services/share-button.service';
import { MAP_CONFIG } from '../../config/map.config';

@Component({
  selector: 'maps-v-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild('mainContainer', { static: false }) mainContainer: ElementRef;
  @ViewChild('bar', { read: ElementRef, static: false }) private bar: ElementRef;

  queryParams = { basemap: null };
  maintenanceOn = false;
  shareContainerActive = false;

  // sharing url string
  shareUrl: string;

  view: any;

  isCopiedToClipboard = false;

  constructor(
    private rend: Renderer2,
    private mapService: MapService,
    private mapStreamService: MapStreamService,
    private viewService: ViewService,
    private basemapsService: BasemapsService,
    private shareButtonService: ShareButtonService,
    @Inject(MAP_CONFIG) private config
  ) { }

  select(inputSelect) {
    inputSelect.select();
  }

  // toggle share container
  shareToggle() {
    this.isCopiedToClipboard = false;
    this.shareContainerActive = !this.shareContainerActive;
    this.shareUrl = this.shareButtonService.shareToggle(this.shareContainerActive);
  }

  initBasemaps(map) {
    // initiate basemaps
    const basemaps = this.basemapsService.initBasemaps(map);

    // check for errors and add maintenance mode if neccessary
    basemaps.forEach((basemap) => {
      basemap
        .when(
          () => { },
          () => { this.maintenanceOn = true; }
        );
    });
  }

  copy() {
    this.isCopiedToClipboard = false;
    this.isCopiedToClipboard = this.shareButtonService.copyToClipBoard();
  }

  ngOnInit() {
    // create the map
    const map = this.mapService.initMap();
    // create view
    this.view = this.mapService.viewMap(map);

    // initiate basemaps
    this.initBasemaps(map);

    // set map ref
    this.viewService.setmapElementRef(this.mainContainer);
  }

  ngAfterViewInit() {
    this.mapService.setProgressBar(this.bar);

    this.view.when((view) => {
      watchUtils.whenTrue(view, 'updating', () => {
        console.log('UPDATING');
        if (this.bar && this.bar.nativeElement) {
          this.rend.setStyle(this.bar.nativeElement, 'display', 'block');

          this.addLoading(view);
        }
      });
    });
  }

  addLoading(view) {
    const intervalProgress = setInterval(() => {
      if (view) {
        if (!view.updating) {
          clearInterval(intervalProgress);
          this.rend.setStyle(this.bar.nativeElement, 'display', 'none');
        }

      }

      // do not show loading bar when connecting to websocket
      // the bar will run till connection ends
      const streamsViews = this.excludeStreamLayersUpdates(view);
      if (streamsViews.length > 0) {
        clearInterval(intervalProgress);
        // currently only one stream layer per theme
        setTimeout(() => { this.rend.setStyle(this.bar.nativeElement, 'display', 'block'), 2000; });

        if (!streamsViews[0].layer.visible) {
          this.rend.setStyle(this.bar.nativeElement, 'display', 'none');
        }

        try {
          const dataEvent = this.mapStreamService.getStreamLayerView().on('data-received', (e) => {
            this.rend.setStyle(this.bar.nativeElement, 'display', 'none');
            dataEvent.remove();
          });
        } catch (er) {
          this.rend.setStyle(this.bar.nativeElement, 'display', 'none');
        }

      }

    }, 50);
  }

  excludeStreamLayersUpdates(view) {
    return view.layerViews.items.filter(item => item.layer.type === 'stream' && item.updating);
  }


}
