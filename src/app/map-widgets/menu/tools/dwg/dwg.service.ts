import { Injectable, Inject } from '@angular/core';
import Draw from 'arcgis-js-api/views/draw/Draw';
import Polygon from 'arcgis-js-api/geometry/Polygon';
import Graphic from 'arcgis-js-api/Graphic';
import FeatureSet from 'arcgis-js-api/tasks/support/FeatureSet';
import Geoprocessor from 'arcgis-js-api/tasks/Geoprocessor';
import { MapService } from 'src/app/core/services/map.service';
import { MenuToolsService } from '../../menu-tools.service';
import { ToolsList } from '../../tools.list';
import { Symbols } from '../../symbols';
import geometryEngine from 'arcgis-js-api/geometry/geometryEngine';
import { forkJoin, Observable, interval, of } from 'rxjs';
import { switchMapTo, map, take, filter } from 'rxjs/operators';
import { MAP_CONFIG } from '../../../../core/config/map.config';
import JobInfo from 'arcgis-js-api/tasks/support/JobInfo';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DwgService {
  draw: Draw;
  view: any;
  polygon: Polygon;
  graphic: Graphic;
  featureSet = new FeatureSet();
  tool = 'dwg';
  toolTitle: string;
  zip1OutputTitle: string;
  zip2OutputTitle: string;
  resultsMessage: string;
  time: number;
  limits: number;

  // file results promises
  fileResults = [];

  // file results urls
  fileResultsurls = {
    zip1: null,
    zip2: null,
    succes: null
  };
  calculatedUnits: number | string;
  job: Promise<JobInfo>;
  geo: Geoprocessor;

  constructor(
    private mapService: MapService,
    private menuToolsService: MenuToolsService,
    private http: HttpClient,
    @Inject(MAP_CONFIG) private config
  ) { }

  initDraw(view): Draw {
    this.view = view;
    this.draw = new Draw({
      view
    });
    return this.draw;
  }

  setTool(tool: string): void {
    this.tool = tool;
  }

  initGeoprocessor(view) {
    // tslint:disable-next-line: max-line-length
    const url = this.tool === ToolsList.dwg ? this.config.mapOptions.staticServices.extractDWG.url : this.config.mapOptions.staticServices.extractDWGTech.url;
    if (this.tool === ToolsList.dwg) {
      this.zip1OutputTitle = this.config.mapOptions.staticServices.extractDWG.zipFiles.zip1.title;
      this.zip2OutputTitle = this.config.mapOptions.staticServices.extractDWG.zipFiles.zip2.title;
      this.resultsMessage = this.config.mapOptions.staticServices.extractDWG.message;
      this.time = this.config.mapOptions.staticServices.extractDWG.aproxExtractTime;
      this.toolTitle = this.config.mapOptions.staticServices.extractDWG.title;
      this.limits = this.config.mapOptions.staticServices.extractDWG.limitsFrontEnd;

    } else {
      this.zip1OutputTitle = this.config.mapOptions.staticServices.extractDWGTech.zipFiles.zip1.title;
      this.zip2OutputTitle = this.config.mapOptions.staticServices.extractDWGTech.zipFiles.zip2.title;
      this.resultsMessage = this.config.mapOptions.staticServices.extractDWGTech.zipFiles.message;
      this.time = this.config.mapOptions.staticServices.extractDWGTech.aproxExtractTime;
      this.toolTitle = this.config.mapOptions.staticServices.extractDWGTech.title;
      this.limits = this.config.mapOptions.staticServices.extractDWGTech.limitsFrontEnd;
    }
    this.geo = new Geoprocessor({
      url,
      outSpatialReference: view.spatialReference
    });
    return this.geo;
  }

  deactivateAndDisable(evt: Event, drawActive: boolean) {
    // on complete remove class
    // check if drawActive -> unsuspend
    if ((evt.type === 'draw-complete') && drawActive) {
      // first unsuspend layers on draw-complete event
      // set timeout, needed for point element specificallly as we do not want to start identify method too early
      setTimeout(() => {
        this.mapService.unSuspendLayersToggle();
      }, 800);
    }
  }

  drawPolygon(evt, drawActive: boolean, ended = false) {
    // on complete remove class
    this.deactivateAndDisable(evt, drawActive);

    const vertices = evt.vertices;
    // remove existing graphic
    this.view.graphics.removeAll();
    // create a new polygon
    const polygon = new Polygon({
      rings: vertices,
      spatialReference: this.view.spatialReference
    });

    // create a new graphic representing the polygon, add it to the view
    const graphic = new Graphic({
      geometry: polygon,
      symbol: Symbols.polygonSymbol
    });

    // using graphic to show clear button
    // add only if graphic has more than 1 vertex, equal length mroe than 2 arrays
    if (polygon.rings[0].length > 1) {
      this.graphic = graphic;
    }

    this.view.graphics.add(graphic);

    // calculate the area of the polygon
    let area = geometryEngine.planarArea(polygon, 'hectares');
    if (area < 0) {
      area = - area;
    }
    // start displaying the area of the polygon
    this.labelAreas(polygon, area, ended);
  }

  // Label polygon with its area
  labelAreas(geom, area: number, ended: boolean) {
    const graphic = this.menuToolsService.createAreaLabelGraphic(geom, area, ended, 'ha');
    this.view.graphics.add(graphic);

    this.calculatedUnits = area.toFixed(4);
  }

  async submitExtractJob() {
    const params = {};

    // null succes result
    this.fileResultsurls.succes = null;

    this.fileResults = [];
    this.featureSet.features = [this.graphic];
    params[this.config.mapOptions.staticServices.extractDWG.params.name] = this.featureSet;
    this.job = this.geo.submitJob(params);
    const jobInfo = await this.job;
    return this.geo.waitForJobCompletion(jobInfo.jobId).then((res) => {
      const jobId = res.jobId;

      if (res.jobStatus !== 'job-failed') {
        // tslint:disable-next-line: max-line-length
        const zip1OutputName = this.tool === ToolsList.dwg ? this.config.mapOptions.staticServices.extractDWG.zipFiles.zip1.name : this.config.mapOptions.staticServices.extractDWGTech.zipFiles.zip1.name;
        // tslint:disable-next-line: max-line-length
        const zip2OutputName = this.tool === ToolsList.dwg ? this.config.mapOptions.staticServices.extractDWG.zipFiles.zip2.name : this.config.mapOptions.staticServices.extractDWGTech.zipFiles.zip2.name;
        // get results
        const zip1 = this.geo.getResultData(jobId, zip1OutputName);
        const zip2 = this.geo.getResultData(jobId, zip2OutputName);
        // order is important check enum FileIndex
        this.fileResults.push.apply(this.fileResults, [zip1, zip2]);
        this.executeFilesPromises(this.fileResults);
        return true;
      } else {
        this.fileResultsurls.succes = false;
        return false;
      }

    }).catch((error) => {
      console.warn('VP Warn', error);
      // return false and do not execute next step in component
      return false;
    });
  }


  executeFilesPromises(fileResults: any[]) {
    forkJoin(
      fileResults
    ).subscribe((response) => {
      console.log(response);
      this.fileResultsurls.zip1 = response[0].value.url;
      this.fileResultsurls.zip2 = response[1].value.url;
      this.fileResultsurls.succes = true;
    });
  }

  // additional method to get job id and cancel job
  getJobinfo(): Observable<string> {
    const geo = this.geo as any;
    // Get Map keys
    // only 1 job in Map object
    const jobs = geo._timers.keys(); return interval(1000)
      .pipe(
        // tap(b => { console.log('TAP', b) }),
        switchMapTo(of([jobs.next().value])
          .pipe(
            // tap(jobs => { console.log('TAP', jobs) }),
            filter(jobs => jobs.length > 0),
            map(jobs => jobs[0])
          )
        ),
        take(1)
      );
  }

  cancelJob() {
    if (this.job) {
      this.getJobinfo().subscribe(jobId => {
        this.geo.cancelJob(jobId);
      }
      );

    }

  }

}

