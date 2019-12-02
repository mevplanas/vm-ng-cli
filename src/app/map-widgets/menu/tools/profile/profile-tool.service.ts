import { Injectable, Inject } from '@angular/core';
import Geoprocessor from 'arcgis-js-api/tasks/Geoprocessor';
import Draw from 'arcgis-js-api/views/draw/Draw';
import Graphic from 'arcgis-js-api/Graphic';
import FeatureSet from 'arcgis-js-api/tasks/support/FeatureSet';
import { MapService } from 'src/app/core/services/map.service';
import { MenuToolsService } from '../../menu-tools.service';
import { Symbols } from '../../symbols';
import geometryEngine from 'arcgis-js-api/geometry/geometryEngine';

import * as Raven from 'raven-js';
import { MAP_CONFIG } from 'src/app/core/config/map.config';

@Injectable({
  providedIn: 'root'
})
export class ProfileToolService {
  toolActive = false;
  geo: Geoprocessor;
  view: any;
  chartData: any;
  draw: Draw;
  graphic: Graphic;
  featureSet = new FeatureSet();
  job: Promise<any>;
  calculatedUnits: string;

  constructor(
    private mapService: MapService,
    private menuToolsService: MenuToolsService,
    @Inject(MAP_CONFIG) private config
  ) { }

  closeProfile() {
    return this.toolActive = false;
  }

  toggleProfile() {
    return this.toolActive = !this.toolActive;
  }

  initDraw(view): Draw {
    this.view = view;
    this.draw = new Draw({
      view
    });
    return this.draw;
  }

  initGeoprocessor(view) {
    const url = this.config.mapOptions.staticServices.profileGP.url;
    this.geo = new Geoprocessor({
      url,
      outSpatialReference: view.spatialReference,
      returnZ: true
    });
    return this.geo;
  }

  createPolylineGraphic(evt, ended = false) {
    this.deactivateAndDisable(evt);
    this.view.graphics.removeAll();

    const polyline = {
      type: 'polyline', // autocasts as Polyline
      paths: evt.vertices,
      spatialReference: this.view.spatialReference
    };
    const graphic = this.menuToolsService.createGeometry(polyline, Symbols.lineSymbol);

    this.graphic = graphic;
    this.view.graphics.add(graphic);
    if (ended) {
      return this.submitExtractJob();
    }

    // calculate the area of the polygon
    const line = geometryEngine.planarLength(graphic.geometry, 'kilometers');
    const lastIndex = polyline.paths.length - 1;
    this.labelLinesAndPoints('line', polyline.paths[lastIndex], line, ended);
  }

  // Label text
  labelLinesAndPoints(geometryType: string, points, geometry = null, ended = false) {
    const endString = ended ? '' : ' (užbaigti dvigubu paspaudimu)';
    let text: string;
    // tslint:disable-next-line: max-line-length
    geometryType === 'line' ? text = geometry.toFixed(3) + ' km' + endString : text = `x: ${points[1].toFixed(2)}, y: ${points[0].toFixed(2)}`;
    // tslint:disable-next-line: max-line-length
    geometryType === 'line' ? this.calculatedUnits = geometry.toFixed(3) + ' km' : this.calculatedUnits = `x: ${points[1].toFixed(2)}, <br>y: ${points[0].toFixed(2)}`;
    const graphic = this.menuToolsService.createLineOrPointLabelGraphic(points, text, this.view);
    this.view.graphics.add(graphic);
  }

  deactivateAndDisable(evt) {
    // on complete remove class
    if (evt.type === 'draw-complete') {
      // first unsuspend layers on draw-complete event
      // set timeout, needed for point element specificallly as we do not want to start identify method too early
      setTimeout(() => {
        this.mapService.unSuspendLayersToggle();
      }, 800);
    }

  }

  submitExtractJob() {
    const params = {
      // TODO expand choice list, curent list: [ , FINEST, 1m ]
      DEMResolution: 'FINEST' // default '1m'
    };

    this.featureSet.features = [this.graphic];
    params[this.config.mapOptions.staticServices.profileGP.params.name] = this.featureSet;
    this.job = this.geo.execute(params);
    return this.job.then((res) => {
      if (res.jobStatus !== 'job-failed') {
        return res.results[0].value.features[0];
      } else {

      }

    }).catch((err) => {
      Raven.captureMessage('VP warn: profile running out of extent ' + err, {
        level: 'warn' // one of 'info', 'warning', or 'error'
      });
      console.warn('VP warn', err);
      return err;
    });
  }

}

