import { Injectable, Inject } from '@angular/core';
import { MapService } from '../../core/services/map.service';
import { MAP_CONFIG } from '../../core/config/map.config';

import findKey from 'lodash-es/findKey';
import pick from 'lodash-es/pick';
import forIn from 'lodash-es/forIn';

@Injectable({
  providedIn: 'root'
})
export class WaistLayersService {

  constructor(
    private mapService: MapService,
    @Inject(MAP_CONFIG) private config
    ) { }

  addCustomLayers(queryParams, snapshotUrl) {
    // using lodash find and pick themeLayer from options
    const themeName = findKey(this.config.themes, { id: snapshotUrl.path });
    const themeLayers = pick(this.config.themes, themeName)[themeName].layers;
    const map = this.mapService.returnMap();

    // all theme layers will be added to common group layer
    const mainGroupLayer = this.mapService.initGroupLayer(themeName + 'group', 'Atliekos', 'show');
    map.add(mainGroupLayer);

    mainGroupLayer.on('layerview-create', (event) => {
      // create group and add all grouped layers to same group, so we could manage group visibility
      const groupLayer = this.mapService.initGroupLayer('waistSub' + 'group', 'Konteineriai', 'hide-children');
      mainGroupLayer.add(groupLayer);

      groupLayer.on('layerview-create', (event) => {
        forIn(themeLayers, (layer, key) => {
          const popupEnabled = false;

          // add feature layer with opacity 0
          this.mapService.pickCustomThemeLayers(layer, key, queryParams, groupLayer, 0, 'simple-marker');

          this.mapService.pickMainThemeLayers(layer, key, queryParams, popupEnabled, groupLayer);
        });

        // set raster layers
        const rasterLayers = this.mapService.getRasterLayers();
        this.mapService.setRasterLayers(rasterLayers);
      });

    });

    forIn(themeLayers, (layer, key) => {
      const popupEnabled = false;



    });

    // set raster layers
    const rasterLayers = this.mapService.getRasterLayers();
    this.mapService.setRasterLayers(rasterLayers);
  }

}
