import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/core/services/map.service';
import { MenuService } from 'src/app/core/services/menu/menu.service';
import { MetaService } from 'src/app/core/services/meta.service';
import { SearchService } from 'src/app/core/services/search.service';
import { IdentifyService } from 'src/app/core/services/identify.service';
import { ActivatedRoute } from '@angular/router';
import { BasemapsService } from 'src/app/core/services/widgets/basemaps.service';
import { ViewService } from 'src/app/core/services/view.service';
import { ShareButtonService } from 'src/app/core/services/share-button.service';
import { WaistLayersService } from './waist-layers.service';

@Component({
  selector: 'maps-v-waist',
  templateUrl: './waist.component.html',
  styleUrls: ['./waist.component.scss']
})
export class WaistComponent implements OnInit {
  // execution of an Observable,
  subscription: Subscription;
  queryUrlSubscription: Subscription;

  // dojo on map click event handler
  identifyEvent: any;

  queryParams: any;

  map: any;
  view: any;
  search: any;
  mobile: boolean;
  featureLayers: any[];

  helpContainerActive = false;
  shareContainerActive = false;

  // animation for sidebar and map components
  sidebarState = 's-close';

  // sharing url string
  shareUrl: string;

  // bug fix for API 4.4 version
  // add subDynamicLayers sublayers meta data
  subDynamicLayerSubLayers: any;

  sidebarTitle: string;

  maintenanceOn = false;

  // dojo events
  tooltipEvent: any;
  clickEvent: any;

  // tooltip dom
  tooltip: any;

  selectedFeatureAttributes: any;

  totalStatistics = { weight: 0, totalLifts: 0 };


  constructor(
    private cdr: ChangeDetectorRef,
    private _mapService: MapService,
    private menuService: MenuService,
    private metaService: MetaService,
    private searchService: SearchService,
    private identify: IdentifyService,
    private activatedRoute: ActivatedRoute,
    private basemapsService: BasemapsService,
    private viewService: ViewService,
    private renderer2: Renderer2,
    private shareButtonService: ShareButtonService,
    private waistLayersService: WaistLayersService) {
    // Detach this view from the change-detection tree
    this.cdr.detach();
  }

  toggleSidebar() {
    this.sidebarState = this.sidebarState === 's-close' ? 's-open' : 's-close';

    // detect changes when closing sidebar group
    this.cdr.detectChanges();
  }

  openSidebar() {
    this.sidebarState = 's-open';
  }

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

  initView(view) {
    const mainContainerDom = this.viewService.getMapElementRef();

    this.cdr.detectChanges();

    this.clickEvent = view.on('click', (event) => {
      this.selectedFeatureAttributes = 0;
      this.cdr.detectChanges();
      // remove existing graphic
      this._mapService.removeFeatureSelection();

      // else identify with hitTest method
      // find layer and remove it, max 4 layers: polygon, polyline, point, and additional point if scale is set from point to point in mxd
      this._mapService.removeSelectionLayers();

      setTimeout(() => {
        // hitTest check graphics in the view
        this.hitTestFeaturePopup(view, event);

      }, 200);

    }, (error) => { console.error(error); });
  }

  hitTestFeaturePopup(view: any, event: any) {
    // the hitTest() checks to see if any graphics in the view
    // intersect the given screen x, y coordinates
    const screenPoint = {
      x: event.x,
      y: event.y
    };

    view.hitTest(screenPoint)
      .then(features => {
        // console.log('%c Click features', 'font-size: 16px; color: green;', features.results[0].graphic.attributes);

        const values = features.results[0];
        const showResult = values.graphic;
        this.selectedFeatureAttributes = values;

        // this.openSidebar();
        // //this.heatContent = showResult.attributes;

        // add selectionResultsToGraphic
        // tslint:disable-next-line: max-line-length
        const groupFeatureSelectionLayer = this._mapService.initFeatureSelectionGraphicLayer('FeatureSelection', showResult.layer.maxScale, showResult.layer.minScale, 'hide');
        const { geometry, layer, attributes } = showResult;
        const selectionGraphic = this._mapService.initFeatureSelectionGraphic('point', geometry, layer, attributes, '24px');
        groupFeatureSelectionLayer.graphics.add(selectionGraphic);
        this.map.add(groupFeatureSelectionLayer);

        // check this view and its children
        this.cdr.detectChanges();
      });
  }

  ngOnInit() {
    // add basic meta data
    this.metaService.setMetaData();

    this.queryUrlSubscription = this.activatedRoute.queryParams.subscribe(
      (queryParam: any) => {
        return this.queryParams = queryParam;
      }
    );
    this.queryUrlSubscription.unsubscribe();

    this.renderer2.addClass(document.body, 'waist-theme');

    // add snapshot url and pass path name ta Incetable map service
    // FIXME ActivatedRoute issues
    // let snapshotUrl = this.activatedRoute.snapshot.url["0"];
    const snapshotUrl = { path: 'atlieku-tvarkymas' };

    // add sidebar names
    this.sidebarTitle = 'Atliekų tema';

    // return the map
    this.map = this._mapService.returnMap();

    // return view
    this.view = this._mapService.getView();

    // set active basemaps based on url query params
    if (this.queryParams.basemap) {
      this.setActiveBasemap(this.view, this.queryParams.basemap);
    }

    if (snapshotUrl) {
      this.waistLayersService.addCustomLayers(this.queryParams, snapshotUrl);
    }


    this.view.when((view) => {
      this.viewService.createSubLayers(this.queryParams, this.map);

      // if query paremeteters are defined get zoom and center
      this._mapService.centerZoom(view, this.queryParams);

      // add default search widget
      this.search = this.searchService.defaultSearchWidget(view);
      view.ui.add(this.search, {
        position: 'top-left',
        index: 2
      });

      // init identification of default or sub layers on MapView
      // this.identifyEvent = this.identify.identifyLayers(view, 'visible', 'waist');
      // init view and get projects on vie stationary property changes
      this.initView(view);

      this.createQuery('https://atviras.vplanas.lt/arcgis/rest/services/Testavimai/Konteineriu_pakelimai/MapServer/4');
    });
  }

  // TODO add to service
  async createQuery(url) {
    const query = this._mapService.addQuery();
    const queryTask = this._mapService.addQueryTask(url);
    query.returnGeometry = false;
    query.where = '1=1';
    query.outFields = ['Svoris_kg', 'Pakelimo_data_laikas'];
    const results = await queryTask.execute(query).then((result) => {
      return result;
    }, (error) => {
      console.error(error);
    });

    this.getStats(results);

  }

  getStats(result): void {
    result.features.forEach(feature => {
      if (feature.attributes.Svoris_kg) {
        const weight = +feature.attributes.Svoris_kg;
        this.totalStatistics.weight += weight;

      }

      if (feature.attributes.Pakelimo_data_laikas) {
        //  TODO filter only current day
        this.totalStatistics.totalLifts += 1;

      }

    });
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    const subLayersSate = this.menuService.getSubLayersState();
    if (subLayersSate) {
      this.menuService.removeSublayersLayer();
    }

    // close popup
    if (this.view.popup.visible) {
      this.view.popup.close();
    }

    // dojo on remove event handler
    this.identify.removeEvent();
    this.clickEvent.remove();

    // remove theme layers, exclude allLayers (JS API performance BUG)
    this.map.removeAll();

    // clear and destroy search widget and sear data
    this.search.clear();
    this.search.destroy();

    // cursor style auto
    this.renderer2.setProperty(document.body.style, 'cursor', 'auto');

    this.renderer2.removeClass(document.body, 'waist-theme');
  }

}
