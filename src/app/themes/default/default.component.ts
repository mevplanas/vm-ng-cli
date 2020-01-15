import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapService } from '../../core/services/map.service';
import { MenuService } from '../../core/services/menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { BasemapsService } from '../../core/services/widgets/basemaps.service';
import { ViewService } from '../../core/services/view.service';
import { MapStreamService } from '../../core/services/streams/map-stream.service';
import { ShareButtonService } from '../../core/services/share-button.service';
import { MetaService } from '../../core/services/meta.service';
import { SearchService } from '../../core/services/search.service';
import { IdentifyService } from '../../core/services/identify.service';
import { EsriEvent } from 'src/app/core/models/esri-event';
import MapView from 'arcgis-js-api/views/MapView';
import Map from 'arcgis-js-api/Map';
import Search from 'arcgis-js-api/widgets/Search';

@Component({
  selector: 'maps-v-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements AfterViewInit, OnDestroy {
  // execution of an Observable,
  queryUrlSubscription: Subscription;

  // dojo on map click event handler
  identifyEvent: EsriEvent;

  queryParams: any;
  maintenanceOn = false;

  map: Map;
  view: MapView;
  search: Search;
  featureLayers: any[];

  helpContainerActive = false;
  shareContainerActive = false;

  // sharing url string
  shareUrl: string;

  // bug fix for API 4.4 version
  // add subDynamicLayers sublayers meta data
  subDynamicLayerSubLayers: any;

  mobileActive = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private mapService: MapService,
    private menuService: MenuService,
    private metaService: MetaService,
    private searchService: SearchService,
    private identify: IdentifyService,
    private activatedRoute: ActivatedRoute,
    private basemapsService: BasemapsService,
    private viewService: ViewService,
    private mapStreamService: MapStreamService,
    private shareButtonService: ShareButtonService) { }

  select(e) {
    e.target.select();
  }

  // toggle share container
  shareToggle(e) {
    this.shareContainerActive = !this.shareContainerActive;
    this.shareUrl = this.shareButtonService.shareToggle(e, this.shareContainerActive);
  }

  setActiveBasemap(view, basemap: string) {
    // toggle basemap
    this.basemapsService.toggleBasemap(basemap, view);
  }

  ngAfterViewInit(): void {
    // add basic meta data
    this.metaService.setMetaData();

    this.queryUrlSubscription = this.activatedRoute.queryParams.subscribe(
      (queryParam: any) => {
        this.queryParams = queryParam;
      }
    );
    this.queryUrlSubscription.unsubscribe();
    // add snapshot url and pass path name ta Incetable map service
    // FIXME ActivatedRoute issues
    // const snapshotUrl = this.router.url.slice(1);
    const snapshotUrl = window.location.pathname.slice(1);

    this.map = this.mapService.returnMap();
    this.view = this.mapService.getView();

    // set active basemaps based on url query params
    if (this.queryParams.basemap) {
      this.setActiveBasemap(this.view, this.queryParams.basemap);
    }

    // create theme layersStatus
    if (snapshotUrl) {
      this.viewService.createThemeLayers(snapshotUrl, this.queryParams);
    };
    this.view.when((view) => {
      this.viewService.createSubLayers(this.queryParams, this.map);

      // if query paremeteters are defined get zoom and center
      this.mapService.centerZoom(view, this.queryParams, snapshotUrl);

      // add default search widget
      this.search = this.searchService.defaultSearchWidget(view);
      view.ui.add(this.search, {
        position: 'top-right',
        index: 2
      });

      // run change detection
      this.cdr.detectChanges();

      // init identification of default or sub layers on MapView
      this.identifyEvent = this.identify.identifyLayers(this.view);
    }, err => { console.error('VP error: view loading issues ', err); });
  }

  ngOnDestroy() {
    // remove sublayers layers cache and close sidebar if iniatialised
    // TODO change to router chage subscriptiopn on map-view
    const subLayersSate = this.menuService.getSubLayersState();
    if (subLayersSate) {
      this.menuService.removeSublayersLayer();
    }

    // close popup
    if (this.view.popup.visible) {
      this.view.popup.close();
    }

    // dojo on remove event handler
    this.identifyEvent.remove();

    // remove theme layers, exclude allLayers (JS API performance BUG)
    this.map.removeAll();

    // clear and destroy search widget and sear data
    this.search.clear();
    this.search.destroy();

    // destroy streams (only if exists)
    this.mapStreamService.destroy();

  }
}
