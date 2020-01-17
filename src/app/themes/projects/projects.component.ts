import { Component, OnInit, ViewChild, ChangeDetectorRef, Renderer2, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MapService } from 'src/app/core/services/map.service';
import { MenuService } from 'src/app/core/services/menu/menu.service';
import { MetaService } from 'src/app/core/services/meta.service';
import { SearchService } from 'src/app/core/services/search.service';
import { IdentifyService } from 'src/app/core/services/identify.service';
import { BasemapsService } from 'src/app/core/services/widgets/basemaps.service';
import { ShareButtonService } from 'src/app/core/services/share-button.service';
import { MAP_CONFIG } from 'src/app/core/config/map.config';

import all from 'dojo/promise/all';
import * as watchUtils from 'arcgis-js-api/core/watchUtils';
import MapView from 'arcgis-js-api/views/MapView';
import Map from 'arcgis-js-api/Map';

import { Subscription } from 'rxjs';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsListService } from './projects-list/projects-list.service';
import { FeatureQueryService } from './feature-query.service';
import { PointAddRemoveService } from './point-add-remove.service';

@Component({
  selector: 'maps-v-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
// get child component reference
@ViewChild(ProjectsListComponent, { static: false }) projectsListComponent: ProjectsListComponent;

private itvFeatureUrl: string = this.config.themes.itvTheme.layers.uniqueProjects + '/0';

// execution of an Observable,
subscription: Subscription;
httpSubscription: Subscription;
queryUrlSubscription: Subscription;

queryParams: any;
sqlString = '';

projectsListArr: any[];
projectsListArrToComponent: any[];
// fullList: Array<any>;
fullListChanged: Array<any>;
autocompleteValue = '';
map: Map;
view: MapView;
search: any;
mobile: boolean;

helpContainerActive = false;
shareContainerActive = false;

// sharing url string
shareUrl: string;

// main projects layer
projectsDynamicLayer: any;

maintenanceOn = false;

// dojo on map click event handler
identifyEvent: any;

// other dojo event handlers
searchEvent: any;
watchU: any;

constructor(
  @Inject(MAP_CONFIG) private config,
  private mapService: MapService,
  private cdr: ChangeDetectorRef,
  private menuService: MenuService,
  private metaService: MetaService,
  private projectsService: ProjectsListService,
  private searchService: SearchService,
  private featureService: FeatureQueryService,
  private identify: IdentifyService,
  private pointAddRemoveService: PointAddRemoveService,
  private activatedRoute: ActivatedRoute,
  private renderer2: Renderer2,
  private basemapsService: BasemapsService,
  private shareButtonService: ShareButtonService) {}

getSqlString() {
  return this.sqlString;
}

// toggle help container
helpOpen() {
  this.helpContainerActive = !this.helpContainerActive;
}

select(e) {
  e.target.select()
}

// toggle share container
shareToggle(e) {
  this.shareContainerActive = !this.shareContainerActive;
  this.shareUrl = this.shareButtonService.shareToggle(this.shareContainerActive, true);
}

onFilter(items) {
  // first item  of items array (items[0]) is filteredList, second input value
  this.autocompleteValue = this.projectsService.filterAutoComplete(items[1]);

  // getprojects when writing in autocomplet box as well
  this.getProjects(this.itvFeatureUrl, this.view.extent, this.sqlString);
}

getFullListChanged() {
  return this.fullListChanged;
}

getProjects(itvFeatureUrl, extent, sqlStr, count = -1) {
  // execute queryTask on projects with extent
  this.projectsService.runProjectsQueryExtent(itvFeatureUrl, extent, sqlStr).then(() => {
    this.projectsListArr = this.projectsService.getProjects();
    this.projectsListArrToComponent = this.projectsService.getProjects();
    this.cdr.detectChanges();
  });
  // execute queryTask on projects without extent
  const inputValue = this.autocompleteValue;
  this.projectsService.runProjectsQuery(itvFeatureUrl, sqlStr, inputValue).then(() => {
    this.fullListChanged = this.projectsService.getAllProjects();
    this.cdr.detectChanges();
  });
}

getFilteredprojects(view, sqlStr) {
  const itvFeatureUrl = this.itvFeatureUrl;
  this.getProjects(itvFeatureUrl, view.extent, sqlStr);
}

initView(view) {

  const itvFeatureUrl = this.itvFeatureUrl;
  const identify = this.identify.identify(this.config.themes.itvTheme.layers.identifyLayer);
  const identifyParams = this.identify.identifyParams();
  let count = 0;

  // get projects when interacting with the view
  this.watchU = watchUtils.whenTrue(view, 'stationary', (b) => {
    const sqlStr = this.getSqlString();
    // Get the new extent of the view only when view is stationary.
    if (view.extent) {
      this.getProjects(itvFeatureUrl, view.extent, sqlStr, count);
      count += 1;
    }
  });

  this.identifyEvent = view.on('click', (event) => {
    // remove selection graphics layer if exist
    this.pointAddRemoveService.removeSelectionLayers();
    // deactivate list selection
    this.projectsListComponent.activateList();

    // find layer and remove it, max 4 layers: polygon, polyline, point, and additional point if scale is set from point to point in mxd
    this.mapService.removeSelectionLayers();

    // NEW map-default.compontent approach
    // store all deffered objects of identify task in def array
    const def: Array<any> = [];
    const ids: any = this.shareButtonService.getVisibleLayersIds(view);
    const visibleLayersIds: number[] = ids.identificationsIds;
    // view.popup.dockEnabled = false;
    // view.popup.dockOptions = {
    //   // Disables the dock button from the popup
    //   buttonEnabled: true,
    //   // Ignore the default sizes that trigger responsive docking
    //   breakpoint: false,
    //   position: 'bottom-left'
    // }
    identifyParams.geometry = event.mapPoint;
    identifyParams.mapExtent = view.extent;
    identifyParams.tolerance = 10;
    identifyParams.width = view.width;
    identifyParams.height = view.height;
    // identifyParams.layerOption = 'all';
    identifyParams.layerOption = 'visible';
    identifyParams.returnGeometry = true;

    // console.log('projects layer', this.projectsDynamicLayer)
    // asgin correct  visible ids based on layer name (layerId property)
    // layerId === item.layer.id
    // NEW TODO: if layer check box is unchecked  - do not identify layer
    const defferedList = this.featureService.identifyProjects(this.projectsDynamicLayer, identifyParams, this.map, this.view)
      .then((response) => {
        // console.log('response', response);
        const currentFilterName: string = this.projectsService.getFilterListName();
        this.projectsListComponent.activateListByID(response['0'].attributes.UNIKALUS_NR, currentFilterName);
        // console.log('response 2', response);
        return response;
      }, (error) => { console.error(error); });

    def.push(defferedList);

    // tslint:disable-next-line: max-line-length
    // using dojo/promise/all function that takes multiple promises and returns a new promise that is fulfilled when all promises have been resolved or one has been rejected.
    all(def).then((response) => {
      // console.log('response def', response)
      let resultsMerge = [].concat.apply([], response.reverse()); // merge all results
      // console.log('response resultsMerge', resultsMerge)
      // filter empty response which was received after map method
      resultsMerge = resultsMerge.filter(res => res);
      // console.log('response resultsMerge 2', resultsMerge)
      if (resultsMerge.length > 0) {
        view.popup.open({
          features: resultsMerge,
          location: event.mapPoint
        });
      }
    });

  });
}

addFeaturesToMap() {
  this.mapService.addFeaturesToMap();
}

setActiveBasemap(view, basemap: string) {
  // toggle basemap
  this.basemapsService.toggleBasemap(basemap, view);
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

  this.projectsService.getAllProjectsQueryData(this.itvFeatureUrl);

  // return the map
  this.map = this.mapService.returnMap();

  // return view
  this.view = this.mapService.getView();

  // set active basemaps based on url query params
  if (this.queryParams.basemap) {
    this.setActiveBasemap(this.view, this.queryParams.basemap);
  }

  // add all projects mapImageLayer
  // tslint:disable-next-line: max-line-length
  this.projectsDynamicLayer = this.mapService.initDynamicLayerITV(this.config.themes.itvTheme.layers.mapLayer, 'itv-projects', 'Investiciniai projektai', 1);
  this.map.add(this.projectsDynamicLayer);

  // set dynamic layer
  this.mapService.setProjectsDynamicLayer(this.projectsDynamicLayer);

  // add additional 2 layers as base
  // tslint:disable-next-line: max-line-length
  this.map.add(this.mapService.initDynamicLayerITV(this.config.themes.itvTheme.layers.teritories, 'itv-additional', 'Teritorijų ribos', 0.2));

  // count feature layers, init and add feature layers to map
  this.addFeaturesToMap();

  this.renderer2.addClass(document.body, 'map-col');
  this.renderer2.addClass(document.body, 'map-projects');


  this.view.when((view) => {
    // if query paremeteters defined zoom and center
    this.mapService.centerZoom(view, this.queryParams);
    // do not initVIew on every new subscribe event
    // subscribe expression str change, when user is filtering projects-theme
    this.subscription = this.featureService.expressionItem.subscribe(sqlStr => {
      this.sqlString = sqlStr;
      // get properties on filtering event passing a sql string
      this.getFilteredprojects(view, sqlStr);
    });

    // add default search widget
    this.search = this.searchService.defaultSearchWidget(view);
    view.ui.add(this.search, {
      position: 'top-right',
      index: 2
    });

    this.searchEvent = this.search.on('search-start', () => {
      this.projectsListComponent.selectFilterByExtention();
    });

    // check other url params if exists
    // activate layer defined in url query params
    this.mapService.activateLayersVisibility(view, this.queryParams, this.map);

    // init view and get projects on vie stationary property changes
    this.initView(view);

  });
}

ngOnDestroy() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }

  const subLayersSate = this.menuService.getSubLayersState();
  if (subLayersSate) {
    this.menuService.removeSublayersLayer();
  }

  // close popup
  if (this.view.popup.visible) {
    this.view.popup.close();
  }

  // dojo remove event handlers
  this.identifyEvent.remove();
  this.watchU.remove();
  this.searchEvent.remove();


  // remove theme layers, exclude allLayers (JS API performance BUG)
  this.map.removeAll();

  // clear and destroy search widget and sear data
  this.search.clear();
  this.search.destroy();

  this.renderer2.removeClass(document.body, 'map-col');
  this.renderer2.removeClass(document.body, 'map-projects');
}

}
