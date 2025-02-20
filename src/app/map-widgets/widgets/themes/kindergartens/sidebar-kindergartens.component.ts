import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Inject,
} from "@angular/core";
import { DataStore } from "../../../../themes/kindergartens/kindergartens.service";
import { MapWidgetsService } from "../../map-widgets.service";
import { MapService } from "../../../../core/services/map.service";
import { SearchService } from "../../../../core/services/search.service";
import { MenuToolsService } from "../../../../map-widgets/menu/menu-tools.service";
import FeatureSet from "arcgis-js-api/tasks/support/FeatureSet";
import BufferParameters from "arcgis-js-api/tasks/support/BufferParameters";
import Graphic from "arcgis-js-api/Graphic";
import Polygon from "arcgis-js-api/geometry/Polygon";
import { Symbols } from "../../../../map-widgets/menu/symbols";
import { MAP_CONFIG } from "../../../../core/config/map.config";
import { SelectorsService } from "./selectors.service";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

// tslint:disable-next-line: no-conflicting-lifecycle
@Component({
  selector: "maps-v-sidebar-kindergartens",
  templateUrl: "./sidebar-kindergartens.component.html",
  styleUrls: ["./sidebar-kindergartens.component.scss"],
  animations: [
    trigger("innerSidebarState", [
      state(
        "s-close",
        style({
          transform: "translateX(326px)",
        })
      ),
      state(
        "s-open",
        style({
          transform: "translateX(0)",
        })
      ),
      transition("s-open => s-close", animate("100ms ease-in")),
      transition("s-close => s-open", animate("100ms ease-out")),
    ]),
    trigger("infoState", [
      state(
        "s-close",
        style({
          transform: "translateX(326px)",
        })
      ),
      state(
        "s-open",
        style({
          transform: "translateX(0)",
        })
      ),
      transition("s-open => s-close", animate("100ms ease-in")),
      transition("s-close => s-open", animate("100ms ease-out")),
    ]),
  ],
})
export class SidebarKindergartensComponent implements OnInit {
  @ViewChild("searchWidgetDOM", { static: false }) searchWidgetDOM: ElementRef;
  @Input() mainSidebarState;
  @Input() sidebarContent;
  @Input() dataStore: DataStore;
  @Output() stateChange = new EventEmitter<string>();

  innerState = "s-close";
  sidebarInfoState = "s-close";

  selectionByFilterState = false;

  groups: Array<any>;

  analyzeParams = {
    eldership: 0,
    groupByAge: "",
    groupByLang: "",
    hasVacancy: false,
    groupByType: "",
    groupByName: "",
    groupByAddress: "",
    bufferSize: 2,
  };

  // dataStore: DataStore;

  // filters data
  dataAge: any[];
  dataLang: any[];
  dataType: any[];
  dataName: any[];

  searchWidget: any;

  filteredGartens: any[];

  geometryService: any;

  // full administration area
  fullArea: any;

  selectedGartenId: number;
  filtersOn = false;
  distance: number;

  constructor(
    public cdr: ChangeDetectorRef,
    private mapWidgetsService: MapWidgetsService,
    private mapService: MapService,
    private selectorsService: SelectorsService,
    private searchService: SearchService,
    private menuToolsService: MenuToolsService,
    @Inject(MAP_CONFIG) private config
  ) {}

  ngOnInit() {
    this.geometryService = this.menuToolsService.addGeometryService(
      this.config.mapOptions.staticServices.geometryUrl
    );

    this.simpleQuery(
      this.config.themes.kindergartens.layers.darzeliai.dynimacLayerUrls + "/3"
    ).then((features) => {
      this.fullArea = features[0];
    });
  }

  // check if any filter is has been set
  isFiltered() {
    const {
      groupByAge,
      groupByLang,
      hasVacancy,
      groupByType,
      groupByName,
      groupByAddress,
    } = this.analyzeParams;
    // console.log('change', this.analyzeParams);
    if (
      groupByAge !== "" ||
      groupByLang !== "" ||
      hasVacancy ||
      groupByType !== "" ||
      groupByName !== "" ||
      groupByAddress !== ""
    ) {
      this.filtersOn = true;
      this.cdr.detectChanges();
    } else {
      this.filtersOn = false;
      this.cdr.detectChanges();
    }
  }

  resetFilters() {
    const search = this.searchService.returnGartensSearchWidget();
    search.searchTerm = "";
    this.selectedGartenId = null;
    // remove existing graphic
    this.mapService.removeFeatureSelection();
    this.filtersOn = false;
    this.filteredGartens = this.dataStore.mainInfo;
    this.analyzeParams = {
      eldership: null,
      groupByAge: "",
      groupByLang: "",
      hasVacancy: false,
      groupByType: "",
      groupByName: "",
      groupByAddress: "",
      bufferSize: 2,
    };
    this.filterGartens();
  }

  selectGartens(id: number, domElement) {
    // console.log('selected \n', id, '\n', domElement);
    domElement.scrollTop = 0;
    const map = this.mapService.returnMap();
    const view = this.mapService.getView();
    const featureLayer = map.findLayerById("feature-darzeliai");
    const query = this.mapService.addQuery();
    this.selectedGartenId = id;

    // remove existing graphic
    this.mapService.removeFeatureSelection();

    query.returnGeometry = true;
    query.where = `GARDEN_ID=${id}`;
    featureLayer.queryFeatures(query).then((results) => {
      const features = results.features[0];
      let fullData = null;
      const dataStore = this.dataStore;
      dataStore.mainInfo.forEach((data) => {
        if (data.GARDEN_ID === id) {
          fullData = Object.assign({}, data);
        }
      });

      const keysToCheck = ["ELDERATE", "ELDERATE2", "ELDERATE3", "ELDERATE4"];

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

      view.goTo(
        {
          target: features.geometry,
          zoom: 4,
        },
        this.config.animation.options
      );

      this.sidebarContent = fullData;

      this.toggleInfoContent();

      if (this.dataStore && this.sidebarContent) {
        this.groups = this.dataStore.info.filter(
          (data) => data.DARZ_ID === this.sidebarContent.GARDEN_ID
        );
        this.cdr.detectChanges();
      }
      const groupFeatureSelectionLayer =
        this.mapService.initFeatureSelectionGraphicLayer(
          "FeatureSelection",
          features.layer.maxScale,
          features.layer.minScale,
          "hide"
        );
      const { geometry, layer, attributes } = features;
      const selectionGraphic = this.mapService.initFeatureSelectionGraphic(
        "point",
        geometry,
        layer,
        attributes,
        "26px",
        "dash"
      );
      groupFeatureSelectionLayer.graphics.add(selectionGraphic);
      map.add(groupFeatureSelectionLayer);
    });
  }

  filterGartens() {
    const search = this.searchService.returnGartensSearchWidget();
    this.selectionByFilterState = true;
    const view = this.mapService.getView();
    view.graphics.removeAll();
    // remove existing graphic
    this.mapService.removeFeatureSelection();
    // remove info content and selection if exists
    this.selectedGartenId = null;
    this.sidebarContent = null;

    if (search.searchTerm.length > 0) {
      this.distance = this.analyzeParams.bufferSize;
      this.analyzeParams.groupByAddress = search.searchTerm;
      this.isFiltered();
      // search using search widget
      search.autoSelect = true;
      search.search().then((e) => {
        const searchGeometry = search.results[0].results[0].feature.geometry;
        // tslint:disable-next-line: max-line-length
        this.mapService
          .runQueryByGeometry(
            this.config.themes.kindergartens.layers.darzeliai.dynimacLayerUrls +
              "/2",
            searchGeometry
          )
          .then((result: FeatureSet) => {
            this.analyzeParams.eldership = result.features[0].attributes.NR;
            const idsGartens = this.mapWidgetsService.filterKindergartents(
              this.dataStore,
              this.analyzeParams
            );
            this.createBuffer(
              this.analyzeParams,
              search.results[0].results[0].feature
            ).then((buffer) => {
              const url =
                this.config.themes.kindergartens.layers.darzeliai
                  .dynimacLayerUrls + "/0";
              this.createQuery(buffer, url, idsGartens).then(
                (filteredIds: any[]) => {
                  this.filteredGartens = this.dataStore.mainInfo.filter(
                    (data) => filteredIds.includes(data.GARDEN_ID)
                  );
                  this.mapWidgetsService.selectKindergartens(
                    filteredIds,
                    this.selectionByFilterState,
                    buffer
                  );
                  if (this.filteredGartens.length > 0) {
                    this.createBufferPolygon(this.fullArea, buffer);
                  }

                  this.cdr.detectChanges();
                }
              );
            });
          });
      });
    } else {
      const idsGartens = this.mapWidgetsService.filterKindergartents(
        this.dataStore,
        this.analyzeParams
      );
      this.distance = null;

      // do not use search widget
      this.filteredGartens = this.dataStore.mainInfo.filter((data) =>
        idsGartens.includes(data.GARDEN_ID)
      );
      this.mapWidgetsService.selectKindergartens(
        idsGartens,
        this.selectionByFilterState
      );

      this.cdr.detectChanges();
    }
  }

  openSidaberGroup(name: string) {
    switch (name) {
      case "info":
        this.sidebarInfoState = "s-open";
        break;
    }
  }

  closeSidaberGroup(name: string = "") {
    switch (name) {
      case "info":
        this.sidebarInfoState = "s-close";
        break;
      default:
        this.sidebarInfoState = "s-close";
    }
  }

  createBuffer(options: any, point) {
    // add required options for buffer execution
    const parameters = new BufferParameters();
    const view = this.mapService.getView();
    parameters.distances = [options.bufferSize];
    parameters.unit = "kilometers";
    parameters.geodesic = true;
    // options.bufferSpatialReference = new SpatialReference({wkid: 3346});
    parameters.bufferSpatialReference = view.spatialReference;
    // parameters.spatialReference = new SpatialReference({wkid: 2600});
    parameters.outSpatialReference = view.spatialReference;
    parameters.geometries = [point.geometry];
    return this.geometryService.buffer(parameters).then((results) => {
      const polyline = new Graphic({
        geometry: results[0],
      });
      return polyline;
    });
  }

  createBufferPolygon(geometries, geometry) {
    const view = this.mapService.getView();
    // console.log('DIF', geometries, geometry);
    return this.geometryService
      .difference([geometries.geometry], geometry.geometry)
      .then((results) => {
        // console.log('DIF', results);
        const polygon = new Polygon({
          rings: results[0].rings,
          spatialReference: view.spatialReference,
        });
        const selectionRing = new Graphic({
          geometry: polygon,
          symbol: Symbols.selectionPolygonDark,
        });
        view.graphics.add(selectionRing);
      });
  }

  // create buffer query and return results
  createQuery(polyline, url, ids: number[]) {
    const query = this.mapService.addQuery();
    const queryTask = this.mapService.addQueryTask(url);
    const idsQueryString = ids.join(", ");
    query.returnGeometry = false;
    // TODO add fixed logic, currently if no ids matching, create not existing query
    query.where =
      idsQueryString.length > 0
        ? `GARDEN_ID in (${idsQueryString})`
        : "GARDEN_ID=9999999";
    query.outFields = ["*"];
    query.geometry = polyline.geometry;

    return queryTask.execute(query).then(
      (result) => {
        const featuresIds = result.features.map((feature) => {
          return feature.attributes.Garden_Id;
        });

        // console.log('featuresIds', featuresIds);

        return featuresIds;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  simpleQuery(url) {
    const query = this.mapService.addQuery();
    const queryTask = this.mapService.addQueryTask(url);
    query.where = "1=1";
    query.returnGeometry = true;
    query.outFields = ["*"];
    return queryTask.execute(query).then(
      (result) => {
        const features = result.features;
        return features;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  toggleInfoContent() {
    // close main heat content while adding animation
    this.innerState = "s-close";

    if (this.sidebarContent && this.mainSidebarState === "s-open") {
      // add setTimeout  for main heat content animation
      setTimeout(() => {
        this.innerState = "s-open";
        this.cdr.detectChanges();
      }, 200);
    }
  }

  closeInfo() {
    this.selectedGartenId = null;
    this.sidebarContent = null;
    // remove existing graphic
    this.mapService.removeFeatureSelection();
    this.cdr.detectChanges();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngDoCheck() {
    this.cdr.detectChanges();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges() {
    if (this.dataStore) {
      this.filteredGartens = this.dataStore.mainInfo;
      this.dataAge = this.selectorsService.getUniqueAttribute(
        this.dataStore.info,
        "TYPE_LABEL"
      );
      // console.log("UNIQUE dataAge: ", this.dataAge)
      this.dataLang = this.selectorsService.getUniqueAttribute(
        this.dataStore.info,
        "LAN_LABEL"
      );
      // console.log("UNIQUE dataLang: ", this.dataLang)
      this.dataType = this.selectorsService.getUniqueAttribute(
        this.dataStore.mainInfo,
        "SCHOOL_TYPE"
      );
      // console.log("UNIQUE dataType: ", this.dataType)
      this.dataName = this.selectorsService.getUniqueAttribute(
        this.dataStore.mainInfo,
        "LABEL"
      );
    }

    if (this.dataStore && this.sidebarContent) {
      this.groups = this.dataStore.info.filter(
        (data) => data.DARZ_ID === this.sidebarContent.GARDEN_ID
      );
      this.selectedGartenId = this.sidebarContent.GARDEN_ID;
    } else {
      this.selectedGartenId = null;
    }
    this.closeSidaberGroup();
    this.toggleInfoContent();
    this.cdr.detectChanges();
  }
}
