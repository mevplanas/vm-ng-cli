import { Component, OnInit, Input, Output, EventEmitter, ElementRef, NgZone, Inject } from '@angular/core';
import { MapService } from '../../../core/services/map.service';
import { ProjectsFilterService } from './projects-filter.service';
import { ProjectsListService } from './projects-list.service';
import { IdentifyService } from '../../../core/services/identify.service';
import Point, { bind } from 'arcgis-js-api/geometry/Point';
import MapView from 'arcgis-js-api/views/MapView';
import Map from 'arcgis-js-api/Map';

import all from 'dojo/promise/all';
import { FeatureQueryService } from '../feature-query.service';
import { PointAddRemoveService } from '../point-add-remove.service';
import { MAP_CONFIG } from '../../../core/config/map.config';

@Component({
  selector: 'maps-v-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  @Input() map: Map;
  @Input() view: MapView;
  @Input() projectsList: any;
  @Input() projectsListOriginal: any;
  @Input() fullListChanged: any;
  @Input() highlight: string;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFilter = new EventEmitter<any>();

  mapListActive: number;
  wordListActive: number;

  fullList: any;

  public query = '';
  public projects: any[];
  public filteredList = [];
  public elementRef: ElementRef;
  selectedIdx =  -1;
  projectsThemes: number[];
  projectsFinalYears: string[];
  buttonActive = false;
  activeTheme;
  activeYear;
  // activated filters number badge property
  activatedFiltersNumber = 0;

  // calculate selection point coordinates    let pointX;
  pointX: number;
  pointY: number;

  // radio buttons data binding for filtering by map or by word
  // using for direct viewing on map with hitTest method as well
  mainFilterCheck = 'word';

  keyUpDelay = (() => {
    let timer: number | any = 0;
    return (callback, ms) => {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  constructor(
    @Inject(MAP_CONFIG) private config,
    private mapService: MapService,
    private filterThemes: FeatureQueryService,
    private ngZone: NgZone,
    private projectsFilter: ProjectsFilterService,
    private projectsListService: ProjectsListService,
    private identify: IdentifyService,
    private pointAddRemoveService: PointAddRemoveService) { }

  ngOnInit() {
    // get full list binding and then proceed
    // set projetcs unique final years for filtering
    // Observable unsubscribes with first operator
    this.projectsListService.fullListItem.subscribe(fullList => {
      this.fullList = fullList;
      this.projectsFinalYears = this.projectsFilter.getUniqueAttributeSubStr(fullList, 'Igyvend_IKI', 4);

      // filter by TemaID
      this.projectsThemes = this.projectsFilter.getUniqueAttribute(fullList, 'TemaID');

      // send years and themes array to Map object in feature query service
      this.filterThemes.sendToMap(this.projectsFinalYears, this.projectsThemes);

      // set active class on init
      this.activeTheme = this.filterThemes.getFilterStatusTheme();
      this.activeYear = this.filterThemes.getFilterStatusYear();
    }
    );
  }

  // activate word or map list item
  activateList(e = null, listName: string = null) {
    this.ngZone.run(() => {
      if (listName === 'word') {
        this.wordListActive = e.target.id;
        // deactivate mapListActive
        this.mapListActive = null;
      } else if (listName === 'map') {
        this.mapListActive = e.target.id;
        // deactivate wordListActive
        this.wordListActive = null;
      } else {
        // deactivate list selection
        this.wordListActive = null;
        this.mapListActive = null;
      }
    });

  }

  // getactivatedListName
  getListName() {
    return this.mainFilterCheck;
  }

  // when searching address select filter by extention
  selectFilterByExtention() {
    this.mainFilterCheck = 'map';
    this.projectsListService.setFilterListName(this.mainFilterCheck);
    // alert("map")
  }

  // identify list item
  identifyListItem(e, project) {
    e.stopPropagation();
    // close advanced filters container if opened
    if (this.buttonActive) {
      this.buttonActive = false;

    }
    // start idenfify, pass project
    this.identifyAttributes(project);
  }

  removeSelectionLayers(): void {
    // find layer and remove it, max 4 layers: polygon, polyline, point, and additional point if scale is set from point to point in mxd
    this.mapService.removeSelectionLayers();
  }

  // activate word or map list item directly from map
  activateListByID(id: number = null, listName: string = null) {
    if (listName === 'word') {
      this.wordListActive = id;
      // deactivate mapListActive
      this.mapListActive = null;
    } else {
      this.mapListActive = id;
      // deactivate wordListActive
      this.wordListActive = null;
    }
  }

  // list item identify
  identifyAttributes(project: any) {
    const query = this.projectsListService.Query();
    const queryTask = this.projectsListService.QueryTask(this.config.themes.itvTheme.layers.uniqueProjects + '/0');

    // remove any selection layers
    this.removeSelectionLayers();

    // TODO remove old graphic if exists
    this.view.graphics.items = [];
    query.where = 'UNIKALUS_NR=' + project.attributes.UNIKALUS_NR;
    query.outFields = ['*'];
    query.returnGeometry = true;
    queryTask.execute(query).then(this.queryTaskExecution.bind(this, project), (err) => console.warn(err));
  }

  queryTaskExecution(project, results) {
    const projectsDynamicLayer = this.mapService.getProjectsDynamicLayer();
    // store all deffered objects of identify task in def array
    const def: Promise<any>[] = [];
    const identifyParams = this.identify.identifyParams();
    const geometry = results.features['0'].geometry;

    identifyParams.geometry = geometry;
    identifyParams.mapExtent = this.view.extent;
    identifyParams.tolerance = 10;
    identifyParams.width = this.view.width;
    identifyParams.height = this.view.height;
    identifyParams.layerOption = 'visible';
    identifyParams.returnGeometry = true;

    // tslint:disable-next-line: max-line-length
    const defferedList = this.filterThemes.identifyProjects(projectsDynamicLayer, identifyParams, this.map, this.view, project.attributes.UNIKALUS_NR)
      .then((response) => {
        this.activateListItem(response);
        return response;
      }, (error) => { console.error(error); });

    def.push(defferedList);

    // tslint:disable-next-line: max-line-length
    // TODO consider removing promise all, as we do not need it so far, we will get only one response, not using any other service idintification in projects theme so far.
    // tslint:disable-next-line: max-line-length
    // using dojo/promise/all function that takes multiple promises and returns a new promise that is fulfilled when all promises have been resolved or one has been rejected.
    all(def).then(this.creatPopupWithListItems.bind(this));

    this.createPopup(results, project);
  }

  creatPopupWithListItems(response) {
    let resultsMerge = [].concat.apply([], response.reverse()); // merge all results
    // filter empty response again (just in case) which was received after map method
    resultsMerge = resultsMerge.filter(res => res);
    this.pointAddRemoveService.pointItem.subscribe(point => {
      if (resultsMerge.length > 0) {
        this.view.goTo({
          target: point
        }, this.config.animation.options);
        this.view.popup.open({
          features: resultsMerge,
          location: point
        });
      }

    });
  }

  activateListItem(response) {
    // filter empty response which was received after map method
    const responseMerge = response.filter(res => res);
    const currentFilterName: string = this.projectsListService.getFilterListName();
    // tslint:disable-next-line: radix
    this.activateListByID(parseInt(responseMerge['0'].attributes.UNIKALUS_NR), currentFilterName);
  }

  createPopup(results, project) {
    // count found attributes, a in mxds we are using same layer but with different scale
    let countFoundAttributes = 0;

    let pointXY: number[];

    // init popup
    if ((results.geometryType === 'point') && (results.features['0'].attributes.UNIKALUS_NR === project.attributes.UNIKALUS_NR)) {

      if (countFoundAttributes === 0) {
        pointXY = this.getPointXY(results);
        // clear popup
        this.view.popup.clear();
        this.view.popup.visible = false;

        // change popup position
        this.view.popup.dockEnabled = true;
        this.view.popup.position = 'bottom-center';
        this.initPopup(results, pointXY);
        countFoundAttributes += 1;
      }

    }

  }

  getPointXY(results: any) {
    // get only point coordinates
    let pointX;
    let pointY;
    pointX = results.features[0].geometry.x;
    pointY = results.features[0].geometry.y;
    return [pointX, pointY];
  }

  // selection results to graphic by creating new graphic layer
  queryResultsToGraphic(map: any, results: any, layer: any, number: number): void {
    this.mapService.selectionResultsToGraphic(map, results.features[0], results.features[0]
      .layer.maxScale, results.features[0]
        .layer.minScale, layer, number);
  }

  // init Popup only on point for all geomtry type based on scale
  initPopup(results: any, pointXY) {
    const pt = new Point({
      x: pointXY[0],
      y: pointXY[1],
      spatialReference: {
        wkid: 3346
      }
    });
    this.openPopUp(results, pt);
  }

  openPopUp(results: any, point: any) {
    this.view.popup.open({
      location: point,
      title: results.features[0].attributes.Pavadinimas,
      content: this.projectsListService.getPopUpContent(results.features[0].attributes)
    });

    this.view.goTo({
      target: point
    }, this.config.animation.options);
  }

  // get radio button value on selection
  change(e) {
    this.mainFilterCheck = e.value;
    this.projectsListService.setFilterListName(e.value);
  }

  getList() {
    return this.fullList;
  }

  filter(event: any) {
    // add setTimeout and clearTimeout
    this.keyUpDelay(() => {
      if (this.query !== '') {
        this.filteredList = this.getList().filter((project) => {
          const projectsName = project.attributes.Pavadinimas.toLowerCase();
          return projectsName.indexOf(this.query.toLowerCase()) > -1;
        // }.bind(this));
        });

        // emit filter list and input value for additional query task if any additional filtering occurs
        this.onFilter.emit([this.filteredList, event.target.value]);

        // UPDATE if query is not empty asign this.fullListChanged = this.filteredList;
        this.fullListChanged = this.filteredList;

        if (event.code === 'ArrowDown' && this.selectedIdx < this.filteredList.length) {

          this.selectedIdx++;
        } else if (event.code === 'ArrowUp' && this.selectedIdx > 0) {
          this.selectedIdx--;
        }
      } else {
        this.filteredList = [];
        // emit filter list and input value for additional query task if any additional filtering occurs
        this.onFilter.emit([this.filteredList, event.target.value]);
      }
    }, 200);
  }

  select(item) {
    this.query = item;
    this.filteredList = [];
    this.selectedIdx = -1;
  }

  handleBlur() {
    if (this.selectedIdx > -1) {
      this.query = this.filteredList[this.selectedIdx];
    }
    this.filteredList = [];
    this.selectedIdx = -1;
  }

  handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.filteredList = [];
    }
    this.selectedIdx = -1;
  }

  // theme filter
  filterFeatures(theme: number) {
    this.filterThemes.filterFeatures(theme);
    this.activeTheme = this.filterThemes.getFilterStatusTheme();
    // count total activated filter number bind property to badge
    this.countActivatedFilter();
  }
  filterYear(year: string) {
    this.filterThemes.yearFilterQuery(year);
    this.activeYear = this.filterThemes.getFilterStatusYear();
    // count total activated filter number bind property to badge
    this.countActivatedFilter();
  }

  // count total activated filter number bind property to badge
  countActivatedFilter() {
    // this.activatedFiltersNumber = Object.values(this.activeYear)
    // .reduce((acc, cur) => { !cur ? acc += 1 : acc; return acc; }, 0) + Object.values(this.activeTheme)
    // .reduce((acc, cur) => { !cur ? acc += 1 : acc; return acc; }, 0);
  }

}
