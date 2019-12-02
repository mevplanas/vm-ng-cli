import { Injectable, ElementRef, Inject } from '@angular/core';

import forIn from 'lodash-es/forIn';

import { MapService } from './map.service';
import { StreamConfig } from '../models/stream-config.model';
import { MAP_CONFIG } from '../config/map.config';
import { MenuService } from './menu/menu.service';
import { MapStreamService } from './streams/map-stream.service';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  // map element reference
  private mapElementRef: ElementRef;

  constructor(
    private mapService: MapService,
    private menuService: MenuService,
    private mapStreamService: MapStreamService,
    @Inject(MAP_CONFIG) private config
  ) { }

  setmapElementRef(el: ElementRef): void {
    this.mapElementRef = el;
  }

  getMapElementRef(): ElementRef {
    return this.mapElementRef;
  }

  // create themes' group layer and add all layers to it
  createThemeLayers(snapshotUrl: string, queryParams) {
    const rasterLayers = this.mapService.getRasterLayers();
    // create theme main layers grouped
    // const themeGroupLayer = this.mapService.initGroupLayer("theme-group", "Main theme layers", "show");

    const themeLayers = this.mapService.getThemeOptions(snapshotUrl);

    forIn(themeLayers, (layer, key) => {
      this.mapService.pickMainThemeLayers(layer, key, queryParams);
    });

    // set raster layers
    this.mapService.setRasterLayers(rasterLayers);

    // set stream layers if exists
    const streamsConfig: StreamConfig = this.mapService.getThemeOptions(snapshotUrl, 'streamLayers');
    if (streamsConfig) {
      for (const prop in streamsConfig) {
        const config = streamsConfig[prop];
        this.mapStreamService.createStreamService(config, prop, queryParams);
      }
    }

  }

  // create sub Layers
  // TODO remove sub layers and create custom widget with layers search
  createSubLayers(queryParams, map) {
    // check if allLayers layer  exist
    const allLayersLayer = map.findLayerById('allLayers');
    if (typeof allLayersLayer === 'undefined') {
      // count sub layers and add to map if required
      const responseFeatures = this.mapService.fetchSublayersRequest(this.config.mapOptions.staticServices.commonMaps);
      this.mapService.addToMap(responseFeatures, queryParams);
      // TODO remove
      if (queryParams.allLayers && (queryParams.identify === 'allLayers')) {
        // set sublayers state as we will load all layers layer on map
        this.menuService.setSubLayersState();
      }
    }
  }

}
