import {
   Component, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, Renderer2, Inject, OnDestroy, AfterViewInit
  } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/core/services/map.service';
import { MenuService } from 'src/app/core/services/menu/menu.service';
import { MetaService } from 'src/app/core/services/meta.service';
import { BuildingsTooltipService } from './buildings-tooltip.service';
import { BuildingsLayersService } from './buildings-layers.service';
import { SearchService } from 'src/app/core/services/search.service';
import { IdentifyService } from 'src/app/core/services/identify.service';
import { ActivatedRoute, Params } from '@angular/router';
import { BasemapsService } from 'src/app/core/services/widgets/basemaps.service';
import { ViewService } from 'src/app/core/services/view.service';
import { ShareButtonService } from 'src/app/core/services/share-button.service';
import { MAP_CONFIG } from 'src/app/core/config/map.config';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EsriEvent } from 'src/app/core/models/esri-event';


import Map from 'arcgis-js-api/Map';
import MapView from 'arcgis-js-api/views/MapView';
import Search from 'arcgis-js-api/widgets/Search';

@Component({
  selector: 'maps-v-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
  animations: [
    trigger('sidebarState', [
      state('s-close', style({
        transform: 'translateX(326px)'
      })),
      state('s-open', style({
        transform: 'translateX(0px)'
      })),
      transition('s-open => s-close', animate('100ms ease-in')),
      transition('s-close => s-open', animate('100ms ease-out'))
    ]),
    trigger('mapState', [
      state('s-close', style({
        width: '100%'
      })),
      state('s-open', style({
        width: 'calc(100% - 326px)'
      })),
      transition('s-open => s-close', animate('100ms ease-in')),
      transition('s-close => s-open', animate('100ms ease-out'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingsComponent implements AfterViewInit, OnDestroy {
 @ViewChild('heatContent', { static: false }) heatContent;

 // execution of an Observable,
 subscription: Subscription;
 queryUrlSubscription: Subscription;

 // dojo on map click event handler
 identifyEvent: EsriEvent;

 queryParams: Params;

 map: Map;
 view: MapView;
 search: Search;
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

 constructor(
   private cdr: ChangeDetectorRef,
   private mapService: MapService,
   private menuService: MenuService,
   private metaService: MetaService,
   private buildingsTooltipService: BuildingsTooltipService,
   private buildingsLayersService: BuildingsLayersService,
   private searchService: SearchService,
   private identify: IdentifyService,
   private activatedRoute: ActivatedRoute,
   private basemapsService: BasemapsService,
   private viewService: ViewService,
   private renderer2: Renderer2,
   private shareButtonService: ShareButtonService,
   @Inject(MAP_CONFIG) private config
   ) {
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

   // add tooltip on mouse move
   // TODO remove event on destroy
   const rend = this.renderer2;
   this.buildingsTooltipService.addTooltip(view, this.view, mainContainerDom, rend);

  //  this.cdr.detectChanges();

   this.clickEvent = view.on('click', (event) => {
     // remove existing graphic
     this.mapService.removeFeatureSelection();

     // else identify with hitTest method
     // find layer and remove it, max 4 layers: polygon, polyline, point, and additional point if scale is set from point to point in mxd
     this.mapService.removeSelectionLayers();

     // hitTest check graphics in the view
     this.hitTestFeaturePopup(view, event);
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
       // AD HOC condition logic
       // we should always select 2 features (buildings and quarters  which are under the same layer checkbox)
       // we'd check if first value has address atribute
       // (in case we hitting quarters layer and selected quarter layer with results length === 2)
       // * ------ *
       // TODO remove dublication of buildings selected feature when hitting buildings selection graphic
       if  (features.results.length !== 1 && features.results[0].graphic.attributes.ADRESAS) {
         const showResult = features.results[0].graphic;
         const showResultQuarters = features.results[1].graphic;
         this.openSidebar();
         this.heatContent = {...showResult.attributes, ...showResultQuarters.attributes};

         // add selectionResultsToGraphic
         this.addSelection(showResultQuarters, [21, 96, 2013]);
         this.addSelection(showResult);

         // check this view and its children
         this.cdr.detectChanges();
       } else {
         // zoom if only quarters layer was hit
         if (view.zoom < 4) {
           const params = {
             x: features.results[0].graphic.geometry.centroid.x,
             y: features.results[0].graphic.geometry.centroid.y,
             zoom: 5
           };

           this.mapService.goTo(view, params);
         }

       }

     });
 }

 addSelection(results, outlineColor= [181, 14, 18, 1]): void {
   // tslint:disable-next-line: max-line-length
   const groupFeatureSelectionLayer = this.mapService.initFeatureSelectionGraphicLayer('FeatureSelection', results.layer.maxScale, results.layer.minScale, 'hide');
   const { geometry, layer, attributes } = results;
   // tslint:disable-next-line: max-line-length
   const selectionGraphic = this.mapService.initFeatureSelectionGraphic('polygon', geometry, layer, attributes, undefined, undefined, outlineColor);
   groupFeatureSelectionLayer.graphics.add(selectionGraphic);
   this.map.add(groupFeatureSelectionLayer);
 }

 ngAfterViewInit() {
   // add basic meta data
   this.metaService.setMetaData();

   this.queryUrlSubscription = this.activatedRoute.queryParams.subscribe(
     (queryParam: Params) => {
       return this.queryParams = queryParam;
     }
   );

   this.queryUrlSubscription.unsubscribe();
   this.renderer2.addClass(document.body, 'buldings-theme');

   // add snapshot url and pass path name ta Incetable map service
   // FIXME ActivatedRoute issues
   // let snapshotUrl = this.activatedRoute.snapshot.url["0"];
   const snapshotUrl = { path: 'pastatai' };

   // add sidebar names
   this.sidebarTitle = this.config.themes.buildings.name;

   // return the map
   this.map = this.mapService.returnMap();

   // return view
   this.view = this.mapService.getView();


   // set active basemaps based on url query params
   if (this.queryParams.basemap) {
     this.setActiveBasemap(this.view, this.queryParams.basemap);
   }

   if (snapshotUrl) {
     this.buildingsLayersService.addCustomLayers(this.queryParams, snapshotUrl);
   }

   this.view.when((view: MapView) => {
     this.viewService.createSubLayers(this.queryParams, this.map);

     // if query paremeteters are defined get zoom and center
     this.mapService.centerZoom(view, this.queryParams);

     // add default search widget
     this.search = this.searchService.defaultSearchWidget(view);
     view.ui.add(this.search, {
       position: 'top-right',
       index: 2
     });

     // init identification of default or sub layers on MapView
     this.identifyEvent = this.identify.identifyLayers(view);

     // init view and get projects on vie stationary property changes
     this.initView(view);
   });
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
   this.buildingsTooltipService.clearMemoryAndNodes(this.renderer2);
   if (this.clickEvent) {
     this.clickEvent.remove();
   }

   // remove theme layers, exclude allLayers (JS API performance BUG)
   this.map.removeAll();

   // clear and destroy search widget and sear data
   this.search.clear();
   this.search.destroy();

   // cursor style auto
   this.renderer2.setProperty(document.body.style, 'cursor', 'auto');

   this.renderer2.removeClass(document.body, 'buldings-theme');
 }

}

