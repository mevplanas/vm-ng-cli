import { Injectable, Inject } from '@angular/core';
import { MAP_CONFIG } from 'src/app/core/config/map.config';
import { MapService } from 'src/app/core/services/map.service';
import { LayerViewEvent } from 'src/app/core/models/esri-event';

import { KindergartensService } from './kindergartens.service';

import { Subject, ObservableInput, Observable, from, forkJoin } from 'rxjs';
import findKey from 'lodash-es/findKey';
import pick from 'lodash-es/pick';
import forIn from 'lodash-es/forIn';

@Injectable()
export class KindergartensLayersService {
  dataStoreS = new Subject<ObservableInput<any>>();
  dataStore$ = this.dataStoreS.asObservable();
  constructor(
    private mapService: MapService,
    private kindergartensService: KindergartensService,
    @Inject(MAP_CONFIG) private config
    ) { }

  addCustomLayers(queryParams, snapshotUrl) {
    let dataStore$: Observable<any>;
    // using lodash find and pick themeLayer from options
    const themeName = findKey(this.config.themes, { id: snapshotUrl.path });
    const themeLayers = pick(this.config.themes, themeName)[themeName].layers;
    const mapEsri = this.mapService.returnMap();

    // all theme layers will be added to common group layer
    const mainGroupLayer = this.mapService.initGroupLayer(themeName + 'group', 'Ikimokylinio ugdymo įstaigos', 'show');
    mapEsri.add(mainGroupLayer);

    mainGroupLayer.on('layerview-create', (event: LayerViewEvent) => {
      // create group and add all grouped layers to same group, so we could manage group visibility
      const groupLayer = this.mapService.initGroupLayer('kindergartensSub' + 'group', 'Ikimokylinio ugdymo įstaigos', 'hide-children');
      console.log(groupLayer);
      mainGroupLayer.add(groupLayer);

      groupLayer.on('layerview-create', (event: LayerViewEvent) => {
        forIn(themeLayers, (layer, key) => {
          const popupEnabled = false;

          // add feature layer with opacity 0
          this.mapService.pickCustomThemeLayers(layer, key, queryParams, groupLayer, 0, 'simple-marker');

          this.mapService.pickMainThemeLayers(layer, key, queryParams, popupEnabled, groupLayer);

          // create data Observables from promises and forkJoin all Observables
          const url = layer.dynimacLayerUrls;
          const dataElderates$ = from(
            this.kindergartensService.getAllQueryDataPromise(url + '/4', ['ID', 'LABEL'])
          );
          const dataMainInfo$ = from(
            // tslint:disable-next-line: max-line-length
            this.kindergartensService.getAllQueryDataPromise(url + '/5', ['GARDEN_ID', 'LABEL', 'EMAIL', 'PHONE', 'FAX', 'ELDERATE', 'ELDERATE2', 'ELDERATE3', 'ELDERATE4', 'SCHOOL_TYPE'])
          );
          const dataInfo$ = from(
            // tslint:disable-next-line: max-line-length
            this.kindergartensService.getAllQueryDataPromise(url + '/6', ['DARZ_ID', 'LAN_LABEL', 'TYPE_LABEL', 'CHILDS_COUNT', 'FREE_SPACE'])
          );
          const dataSummary$ = from(
            this.kindergartensService.getAllQueryDataPromise(url + '/7', ['DARZ_ID', 'CHILDS_COUNT', 'FREE_SPACE'])
          );

          dataStore$ = forkJoin(
            dataElderates$,
            dataMainInfo$,
            dataInfo$,
            dataSummary$,
            (elderates: any[], mainInfo: any[], info: any[], summary: any[]) => ({
              elderates,
              mainInfo,
              info,
              summary
            })
          );

          this.dataStoreS.next(dataStore$);
        });

        // set raster layers
        const rasterLayers = this.mapService.getRasterLayers();
        this.mapService.setRasterLayers(rasterLayers);
      });
    });
  }

}
