import { Injectable, Inject } from '@angular/core';

import Search from 'arcgis-js-api/widgets/Search';
import Locator from 'arcgis-js-api/tasks/Locator';
import PictureMarkerSymbol from 'arcgis-js-api/symbols/PictureMarkerSymbol';
import Collection from 'arcgis-js-api/core/Collection';
import MapView from 'arcgis-js-api/views/MapView';

import { MAP_CONFIG } from '../config/map.config';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  gartensSearchWidget: Search;

  constructor(@Inject(MAP_CONFIG) private config) {}

  returnGartensSearchWidget() {
    return this.gartensSearchWidget;
  }

  defaultSearchWidget(view: MapView, url = this.config.search.locator) {
    return new Search({
      view,
      includeDefaultSources: false,
      allPlaceholder: 'Vietos paieška',
      locationEnabled: false,
      sources: [{
        locator: new Locator({ url }),
        singleLineFieldName: 'SingleLine', // AG name of 'Single Line Address Field:'
        outFields: ['*'],
        enableSuggestions: true, // AG only with 10.3 version
        name: 'Paieška',
        enableHighlight: true, // highlight symbol
        enableLabel: false,
        // distance: 20, //search distance
        // enableButtonMode: true,
        // expanded: true,
        localSearchOptions: {
          minScale: 300000,
          distance: 50000
        },
        locationToAddressDistance: 10000,
        placeholder: 'Vietos paieška',
        zoomScale: 6,
        resultSymbol: new PictureMarkerSymbol({
          url: window.location.origin + '/assets/img/map_marker.png',
          width: 28,
          height: 28,
          xoffset: 0,
          yoffset: 12
        })
      }] as any as Collection
    });
  }

  kindergartensSearchWidget(view: any, container: string, placeholder = 'Adreso Paieška') {
    this.gartensSearchWidget = new Search({
      autoSelect: false, // autoselect to false, selection will be based on only button click event
      view,
      container,
      includeDefaultSources: false,
      allPlaceholder: 'Adreso paieška',
      locationEnabled: false,
      sources: [{
        locator: new Locator({ url: 'https://zemelapiai.vplanas.lt/arcgis/rest/services/Lokatoriai/PAIESKA_COMPOSITE/GeocodeServer' }),
        singleLineFieldName: 'SingleLine', // AG name of 'Single Line Address Field:'
        outFields: ['*'],
        enableSuggestions: true, // AG only with 10.3 version
        name: 'Adreso Paieška',
        enableHighlight: true, // highlight symbol
        enableLabel: false,
        // distance: 20, //search distance
        // enableButtonMode: true,
        // expanded: true,
        localSearchOptions: {
          minScale: 300000,
          distance: 50000
        },
        locationToAddressDistance: 10000,
        placeholder,
        zoomScale: 6,
        resultSymbol: new PictureMarkerSymbol({
          url: window.location.origin + '/assets/img/map_marker.png',
          width: 28,
          height: 28,
          xoffset: 0,
          yoffset: 12
        })
      }] as any as Collection
    });
    return this.gartensSearchWidget;
  }
}

