import { Injectable, Inject } from '@angular/core';
import Print from 'arcgis-js-api/widgets/Print';
import Graphic from 'arcgis-js-api/Graphic';
import TextSymbol from 'arcgis-js-api/symbols/TextSymbol';
import Point from 'arcgis-js-api/geometry/Point';
import GeometryService from 'arcgis-js-api/tasks/GeometryService';
import { MAP_CONFIG } from 'src/app/core/config/map.config';

@Injectable({
  providedIn: 'root'
})
export class MenuToolsService {

  // current selected tool containing draw feature
  currentDrawTool = '';

  constructor(@Inject(MAP_CONFIG) private config) { }

  setCurrentDrawTool(tool: string) {
    return this.currentDrawTool = tool;
  }

  initPrint(view) {
    return new Print({
      view,
      printServiceUrl: this.config.mapOptions.staticServices.printServiceUrl,
      container: 'print-menu'
    });
  }

  createGeometry(geometry, symbol) {
    return new Graphic({
      geometry,
      symbol
    });
  }

  createAreaLabelGraphic(geometry, area: number, ended, units = 'm²') {
    const endString = ended ? '' : ' (užbaigti dvigubu paspaudimu)';
    const areaValue = Math.floor(area + 0.5);
    return new Graphic({
      geometry: geometry.centroid,
      symbol: {
        type: 'text',
        color: 'white',
        haloColor: 'black',
        haloSize: '1px',
        text: `${areaValue} ${units} ${endString}`,
        xoffset: 3,
        yoffset: 3,
        font: { // autocast as Font
          size: 10,
          family: 'sans-serif'
        }
      } as any as TextSymbol
    });
  }

  createLineOrPointLabelGraphic(points, text, view) {
    return new Graphic({
      geometry: {
        type: 'point', // autocasts as /Point
        x: points[0],
        y: points[1],
        spatialReference: view.spatialReference
      } as Point,
      symbol: {
        type: 'text',
        color: 'white',
        haloColor: 'black',
        haloSize: 6,
        text,
        xoffset: 3,
        yoffset: 12,
        font: { // autocast as Font
          size: 10,
          family: 'sans-serif'
        }
      } as any as TextSymbol
    });
  }

  addGeometryService(url) {
    return new GeometryService(url);
  }
}

