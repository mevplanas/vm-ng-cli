import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { ShareButtonService } from './share-button.service';
import IdentifyTask from 'arcgis-js-api/tasks/IdentifyTask';
import IdentifyParameters from 'arcgis-js-api/tasks/support/IdentifyParameters';
import LayerOptions from 'arcgis-js-api/popup/LayerOptions';
import { DefaultService } from '../../themes/default/default.service';

import all from 'dojo/promise/all';
import { EsriEvent } from '../models/esri-event';
// type LayerOptions = 'top'|'visible'|'all';

@Injectable({
  providedIn: 'root'
})
export class IdentifyService {
  // dojo events
  mapClickEvent: EsriEvent;

  constructor(
    private mapService: MapService,
    private mapDefaultService: DefaultService,
    private shareButtonService: ShareButtonService) { }

  // identify for mapservice only
  identify(layer: any) {
    return new IdentifyTask(layer);
  }

  identifyParams() {
    return new IdentifyParameters();
  }

  // identify dafault theme layers
  identifyLayers(view, layerOption = 'all', specialLayer = '') {
    const identifyParams = this.identifyParams();
    view.popup.dockOptions = {
      position: 'bottom-left'
    };
    const mapClickEvent = view.on('click', (event) => {
      // check if layer is suspended
      const suspended = this.mapService.getSuspendedIdentitication();
      // store all deffered objects of identify task in def array
      const def = [];
      view.popup.dockEnabled = false;
      view.popup.dockOptions = {
        // Disables the dock button from the popup
        buttonEnabled: true,
        // Ignore the default sizes that trigger responsive docking
        breakpoint: false,
        position: 'bottom-left'
      }

      identifyParams.geometry = event.mapPoint;
      identifyParams.mapExtent = view.extent;
      identifyParams.tolerance = 4;
      identifyParams.width = view.width;
      identifyParams.height = view.height;
      identifyParams.layerOption = layerOption as LayerOptions;

      let identificationLayers: any[];
      // foreach item execute task
      if (specialLayer === 'quarters') {
        identificationLayers = this.mapService.returnMap().findLayerById('quarters').sublayers.items.sort((a, b) => a.id - b.id);
      } else if (specialLayer === 'waist') {
        identificationLayers = this.mapService.returnMap().findLayerById('atliekos').sublayers.items.sort((a, b) => a.id - b.id);
      } else {
        identificationLayers = view.layerViews.items;
      }

      identificationLayers.forEach(item => {
        // do not execute if layer is for buffer graphics and if layer is GroupLayer with list mode 'hide-children'
        // or type is group which means it is dedicated for retrieving data to custom sidebar via feature layer hitTest method
        // skip FeatureSelection layer as well wich is created only for Feature selection graphics
        // TODO remove or refactor allLayers identification
        // tslint:disable-next-line: max-line-length
        if ((item.layer.id !== 'bufferPolygon') && (item.layer.id !== 'allLayers_') && (!suspended) && (item.layer.listMode !== 'hide-children') && (item.layer.type !== 'group') && item.layer.type !== 'stream' && (item.layer.id !== 'FeatureSelection') && (item.layer.id !== 'AreaSelection') && (item.layer.popupEnabled) && item.visible) {
          // if layer is buffer result, add custom visibility
          if (item.layer.id === 'bufferLayers') {
            identifyParams.layerIds = [0];
          } else if (specialLayer === 'quarters') {
            identifyParams.layerIds = [item.id];
          } else if (specialLayer === 'waist') {
            identifyParams.layerIds = [item.id];
          } else {
            const ids: any = this.shareButtonService.getVisibleLayersIds(view);
            const visibleLayersIds = ids.identificationsIds;
            const id = item.layer.id;
            identifyParams.layerIds = [...visibleLayersIds[id]];
          }

          const defferedList = this.identify(item.layer.url).execute(identifyParams).then((response) => {
            const results = response.results.reverse();
            return results.map((result) => {
              const name = result.layerName;
              const feature = result.feature;
              feature.popupTemplate = {
                title: `${name}`,
                content: this.mapDefaultService.getVisibleLayersContent(result)
              };
              // add feature layer id
              feature.layerId = item.layer.id;
              return feature;
            });
          }).then((response) => {
            return response;
          }, (error) => { console.error(error); });

          def.push(defferedList);
        }
      });


      // using dojo/promise/all function that takes multiple promises and returns a new promise
      // that is fulfilled when all promises have been resolved or one has been rejected.
      all(def).then((response) => {
        let resultsMerge = [].concat.apply([], response.reverse()); // merger all results
        // remove empty Values
        resultsMerge = resultsMerge.filter((value) => value);
        if (resultsMerge.length > 0) {
          view.popup.open({
            features: resultsMerge,
            location: event.mapPoint
          });
        }
      });

    });

    return this.mapClickEvent = mapClickEvent;
  }

  removeEvent() {
    if (this.mapClickEvent) {
      this.mapClickEvent.remove();
    }

  }

  showItvPopupOnCLick(view: any, event: any, identify: any, identifyParams: any) {
    identifyParams.geometry = event.mapPoint;
    identifyParams.mapExtent = view.extent;
    identifyParams.tolerance = 5;
    identifyParams.width = view.width;
    identifyParams.height = view.height;
    identifyParams.layerOption = 'top';

    identify.execute(identifyParams).then((response) => {
      const results = response.results;
      return results.map((result) => {
        const feature = result.feature;
        feature.popupTemplate = {
          title: '{Pavadinimas}',
          content: `
                  <p><span class="n{TemaId}-theme projects-theme"></span> {Tema} <br /><span>Tema</span></p>
                  <p>{Busena}<br /><span>Projekto būsena</span</p>
                  <p>{Projekto_aprasymas} <br /><span>Aprašymas</span></p>
                  <p>{Igyvend_NUO} - {Igyvend_IKI} m.<br /><span>Įgyvendinimo trukmė</span></p>
                  <p><a href="{Nuoroda_i_projekta}" target="_blank">{Nuoroda_i_projekta}</a> <br /><span>Projekto nuoroda</span></p>
                  <p>{Veiksmo_nr_ITVP } <br /><span>Programos veiksmas </span></p>
                  <p>{Vykdytojas}<br /><span>Vykdytojas</span></p>
                  <p><a href="{Kontaktai}">{Kontaktai}</a> <br /><span>Kontaktai</span></p>
                  <div class="finance-list">
                    <div>
                    <p>{Projekto_verte} Eur<br /><span>Projekto vertė</span></p>
                    </div>
                    <p>{ES_investicijos} Eur <br /><span>Europos Sąjungos investicijos</span></p>
                    <p>{Savivaldybes_biudzeto_lesos} Eur<br /><span>Savivaldybės biudžeto lėšos</span></p>
                    <p>{Valstybes_biudzeto_lesos} Eur<br /><span>Valstybės biudžeto lėšos</span></p>
                    <p>{Kitos_viesosios_lesos} Eur<br /><span> Kitos viešosios lėšos</span></p>
                    <p>{Privacios_lesos} Eur<br /><span> Privačios lėšos</span></p>
                  </div>
                `
        };
        return feature;
      });
      // tslint:disable-next-line: only-arrow-functions
    }).then(function (response) {
      if (response.length > 0) {
        view.popup.open({
          features: response,
          location: event.mapPoint
        });
      }
    }, (error) => { console.error(error); });
  }
}
