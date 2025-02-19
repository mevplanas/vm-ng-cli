import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { sidebarAnimation } from "../../core/animations/sidebar-animation";
import { Subscription, Observable } from "rxjs";
import { MapService } from "../../core/services/map.service";
import { SearchService } from "../../core/services/search.service";
import { IdentifyService } from "../../core/services/identify.service";
import { ActivatedRoute, Params } from "@angular/router";
import { BasemapsService } from "../../core/services/widgets/basemaps.service";
import { MetaService } from "../../core/services/meta.service";
import { MenuService } from "../../core/services/menu/menu.service";
import { ViewService } from "../../core/services/view.service";
import { KindergartensLayersService } from "./kindergartens-layers.service";
import { KindergartensTooltipService } from "./kindergartens-tooltip.service";
import { ShareButtonService } from "../../core/services/share-button.service";
import { switchMap, take } from "rxjs/operators";
import MapView from "arcgis-js-api/views/MapView";
import Map from "arcgis-js-api/Map";
import Search from "arcgis-js-api/widgets/Search";
import View from "arcgis-js-api/views/View";
import { EsriEvent } from "../../core/models/esri-event";
import { DataStore } from "./kindergartens-interface.model";

export interface ISpatialReference {
  latestWkid: number;
  wkid: number;
}

export interface IGeometry {
  x: number;
  y: number;
  spatialReference: ISpatialReference;
}

@Component({
  selector: "maps-v-kindergartens",
  templateUrl: "./kindergartens.component.html",
  styleUrls: ["./kindergartens.component.scss"],
  animations: [sidebarAnimation],
})
export class KindergartensComponent implements AfterViewInit, OnDestroy {
  @ViewChild("mainContainer", { static: false }) mainContainer: ElementRef;
  @ViewChild("kindergartensContent", { static: false }) kindergartensContent;
  // @HostBinding('style.display') display = 'none';

  // execution of an Observable,
  subscription: Subscription;
  queryUrlSubscription: Subscription;

  // store kindegarten data from different enpoints
  dataStore: DataStore;

  queryParams: Params;

  map: Map;
  view: MapView;
  search: Search;
  mobile: boolean;

  helpContainerActive = false;
  shareContainerActive = false;

  // animation for sidebar and map components
  sidebarState = "s-open";

  // sharing url string
  shareUrl: string;

  // bug fix for API 4.4 version
  // add subDynamicLayers sublayers meta data
  // subDynamicLayerSubLayers: any;

  maintenanceOn = false;

  // dojo events
  clickEvent: EsriEvent;

  constructor(
    private cdr: ChangeDetectorRef,
    private mapService: MapService,
    private searchService: SearchService,
    private identify: IdentifyService,
    private activatedRoute: ActivatedRoute,
    private basemapsService: BasemapsService,
    private metaService: MetaService,
    private menuService: MenuService,
    private viewService: ViewService,
    private kindergartensLayersService: KindergartensLayersService,
    private kindergartensTooltipService: KindergartensTooltipService,
    private renderer2: Renderer2,
    private shareButtonService: ShareButtonService
  ) {
    // Detach this view from the change-detection tree
    this.cdr.detach();
  }

  toggleSidebar() {
    this.sidebarState = this.sidebarState === "s-close" ? "s-open" : "s-close";

    // detect changes when closing sidebar group
    this.cdr.detectChanges();
  }

  openSidebar() {
    this.sidebarState = "s-open";
  }

  select(e) {
    e.target.select();
  }

  // toggle share container
  shareToggle(e) {
    this.shareContainerActive = !this.shareContainerActive;
    this.shareUrl = this.shareButtonService.shareToggle(
      e,
      this.shareContainerActive
    );
  }

  setActiveBasemap(view, basemap: string) {
    // toggle basemap
    this.basemapsService.toggleBasemap(basemap, view);
  }

  initIdentification(view) {
    const mainContainerDom = this.viewService.getMapElementRef();
    const rend = this.renderer2;

    this.kindergartensTooltipService.addTooltip(
      view,
      mainContainerDom,
      rend,
      this.dataStore
    );

    this.cdr.detectChanges();

    this.clickEvent = view.on("click", (event) => {
      // remove existing graphic
      this.mapService.removeFeatureSelection();

      // identify with hitTest method
      // find layer and remove it, max 4 layers: polygon, polyline, point, and additional point if scale is set from point to point in mxd
      this.mapService.removeSelectionLayers();

      // this.view.popup.close()
      // hitTest check graphics in the view
      this.hitTestFeaturePopup(view, event);
    });
  }

  hitTestFeaturePopup(view: MapView, event) {
    // hitTest BUG
    // the hitTest() checks to see if any graphics in the view
    // intersect the given screen x, y coordinates
    const screenPoint = {
      x: event.x,
      y: event.y,
    };

    view.hitTest(screenPoint).then((features) => {
      let fullData = null;
      const values = Array.from(features.results);
      let isShown = false;
      let esriGeometry: IGeometry;
      values.forEach((value: any) => {
        if (values && value.graphic.layer.id !== "feature-area") {
          if (!isShown) {
            isShown = true;
            const showResult = value.graphic;
            const mainInfo = this.dataStore && this.dataStore.mainInfo;

            mainInfo.forEach((data) => {
              if (data.GARDEN_ID === value.graphic.attributes.Garden_Id) {
                fullData = Object.assign({}, data);
              }
            });

            const keysToCheck = [
              "ELDERATE",
              "ELDERATE2",
              "ELDERATE3",
              "ELDERATE4",
            ];

            // Loop through the keysToCheck array and compare them
            for (let i = 0; i < keysToCheck.length; i++) {
              const currentKey = keysToCheck[i];
              const currentValue = fullData[currentKey];

              // Compare the current key with the rest of the keys in the list
              for (let j = i + 1; j < keysToCheck.length; j++) {
                const nextKey = keysToCheck[j];
                const nextValue = fullData[nextKey];

                // If the values are equal, delete the next key
                if (currentValue === nextValue) {
                  delete fullData[nextKey];
                }
              }
            }

            this.openSidebar();
            this.kindergartensContent = fullData;

            // add selectionResultsToGraphic
            // tslint:disable-next-line: max-line-length
            const groupFeatureSelectionLayer =
              this.mapService.initFeatureSelectionGraphicLayer(
                "FeatureSelection",
                showResult.layer.maxScale,
                showResult.layer.minScale,
                "hide"
              );
            const { geometry, layer, attributes } = showResult;

            // BUG 4.5 not getting geometry
            geometry
              ? (esriGeometry = geometry)
              : (esriGeometry = features.mapPoint);

            // tslint:disable-next-line: max-line-length
            const selectionGraphic =
              this.mapService.initFeatureSelectionGraphic(
                "point",
                esriGeometry,
                layer,
                attributes,
                "26px",
                "dash"
              );
            groupFeatureSelectionLayer.graphics.add(selectionGraphic);
            this.map.add(groupFeatureSelectionLayer);
          }
        } else {
          if (!isShown) {
            // TEMP null / 0 trick to initiate component change, as we can add data via sidebar compontent as well
            this.kindergartensContent === null
              ? (this.kindergartensContent = 0)
              : (this.kindergartensContent = null);
          }
        }

        this.cdr.detectChanges();
      });
    });
  }

  ngAfterViewInit() {
    // add basic meta data
    this.metaService.setMetaData();
    this.queryUrlSubscription = this.activatedRoute.queryParams.subscribe(
      (queryParamsReturned: Params) => {
        return (this.queryParams = queryParamsReturned);
      }
    );
    this.queryUrlSubscription.unsubscribe();

    // this.renderer2.addClass(document.body, 'buldings-theme');
    this.renderer2.addClass(document.body, "kindergartens");

    // add snapshot url and pass path name ta Incetable map service
    // FIXME ActivatedRoute issues
    // let snapshotUrl = this.activatedRoute.snapshot.url["0"];
    const snapshotUrl = { path: "darzeliai" };

    // return the map
    this.map = this.mapService.returnMap();

    // return view
    this.view = this.mapService.getView();

    // create theme main layers grouped
    // const themeGroupLayer = this.mapService.initGroupLayer("theme-group", "Main theme layers", "show");

    // set active basemaps based on url query params
    if (this.queryParams.basemap) {
      this.setActiveBasemap(this.view, this.queryParams.basemap);
    }

    this.view.when((view: View) => {
      this.viewService.createSubLayers(this.queryParams, this.map);

      // if query paremeteters are defined get zoom and center
      this.mapService.centerZoom(view, this.queryParams);

      // add default search widget
      this.search = this.searchService.defaultSearchWidget(view);
      view.ui.add(this.search, {
        position: "top-right",
        index: 2,
      });

      // init identification of default or sub layers on MapView
      this.identify.identifyLayers(view);

      if (snapshotUrl) {
        this.kindergartensLayersService.addCustomLayers(
          this.queryParams,
          snapshotUrl
        );

        this.kindergartensLayersService.dataStore$
          .pipe(
            // tap(a =>  console.log(a)),
            switchMap((a) => a),
            take(1)
          )
          .subscribe((dataStore: DataStore) => {
            this.dataStore = dataStore;

            // init identfication logic
            this.initIdentification(view);

            // detect changes before dataStore fetches
            this.cdr.detectChanges();
          });
      }
      // detect changes before dataStore fetches
      this.cdr.detectChanges();
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
    this.kindergartensTooltipService.clearMemoryAndNodes(this.renderer2);
    this.clickEvent.remove();

    // remove theme layers, exclude allLayers (JS API performance BUG)
    this.map.removeAll();

    // clear and destroy search widget and sear data
    this.search.clear();
    this.search.destroy();

    // cursor style auto
    this.renderer2.setProperty(document.body.style, "cursor", "auto");

    this.renderer2.removeClass(document.body, "kindergartens");

    // remove existing graphic
    this.view.graphics.removeAll();
  }
}
