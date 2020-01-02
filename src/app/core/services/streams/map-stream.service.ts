import { Injectable } from '@angular/core';
import { StreamConfig } from '../../../core/models/stream-config.model';
import { MapService } from '../../../core/services/map.service';
import Map from 'arcgis-js-api/Map';
import StreamLayer from 'arcgis-js-api/layers/StreamLayer';
import StreamLayerView from 'arcgis-js-api/views/layers/StreamLayerView';
import LabelClass from 'arcgis-js-api/layers/support/LabelClass';
import Renderer from 'arcgis-js-api/renderers/Renderer';

// Config for workers
// Needs be set as stream services using webworkers
// See https://github.com/esri/arcgis-webpack-plugin#usage
import esriConfig from 'arcgis-js-api/config';

const DEFAULT_WORKER_URL = 'https://maps.vilnius.lt/arcgis_js_api/library/4.13/';
const DEFAULT_LOADER_URL = `${DEFAULT_WORKER_URL}dojo/dojo-lite.js`;

esriConfig.workers.loaderUrl = DEFAULT_LOADER_URL;
esriConfig.workers.loaderConfig = {
  baseUrl: `${DEFAULT_WORKER_URL}dojo`,
  packages: [
    { name: 'esri', location: `${DEFAULT_WORKER_URL}esri` },
    { name: 'dojo', location: `${DEFAULT_WORKER_URL}dojo` },
    { name: 'dojox', location: `${DEFAULT_WORKER_URL}dojox` },
    { name: 'dstore', location: `${DEFAULT_WORKER_URL}dstore` },
    { name: 'moment', location: `${DEFAULT_WORKER_URL}moment` },
    { name: '@dojo', location: `${DEFAULT_WORKER_URL}@dojo` },
    {
      name: 'cldrjs',
      location: `${DEFAULT_WORKER_URL}cldrjs`,
      main: 'dist/cldr'
    },
    {
      name: 'globalize',
      location: `${DEFAULT_WORKER_URL}globalize`,
      main: 'dist/globalize'
    },
    {
      name: 'maquette',
      location: `${DEFAULT_WORKER_URL}maquette`,
      main: 'dist/maquette.umd'
    },
    {
      name: 'maquette-css-transitions',
      location: `${DEFAULT_WORKER_URL}maquette-css-transitions`,
      main: 'dist/maquette-css-transitions.umd'
    },
    {
      name: 'maquette-jsx',
      location: `${DEFAULT_WORKER_URL}maquette-jsx`,
      main: 'dist/maquette-jsx.umd'
    },
    { name: 'tslib', location: `${DEFAULT_WORKER_URL}tslib`, main: 'tslib' }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class MapStreamService {
  private stream: StreamLayer;
  private streamLayerView: StreamLayerView;
  private map: Map;
  private watchHandles = [];
  private timeoutID;
  private config: StreamConfig;
  private id: string;
  private queryParams;
  private streamSuspended = false;
  handle;
  constructor(private mapService: MapService) { }

  // tslint:disable-next-line: max-line-length
  addStream(url: string, visible: boolean, title: string, style: string, color = '#ef7f1a', setRotation = false, rotationAttribute = 'direction', labelFeature, stops= null, id) {
    const outFields = [rotationAttribute, labelFeature];
    if (stops && stops.field) {
      outFields.push(stops.field);
    }
    // create stream layer
    const streamLayer = new StreamLayer({
      url,
      id,
      title,
      visible,
      outFields,
      labelsVisible: true,
      purgeOptions: {
        displayCount: 500,
        age: 2
      }
    });

    const rotationRenderer = {
      type: 'simple', // autocasts as new SimpleRenderer()
      symbol: {
        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
        style,
        // use an SVG path to create an arrow shape
        // Legend widget doesn't honot path property so legend will be empty
        // tslint:disable-next-line: max-line-length
        path: 'M54.15199047330047,1.621444913480601 C36.122233905216476,1.621444913480601 21.505981653418786,16.23769716527829 21.505981653418786,34.26745373336229 C21.505981653418786,52.29742629134226 43.94538793811259,94.34698721310683 54.15199047330047,94.34698721310683 S86.79799929318216,52.29721030144628 86.79799929318216,34.26745373336229 C86.79799929318216,16.23769716527829 72.18174704138447,1.621444913480601 54.15199047330047,1.621444913480601',
        color,
        outline: {
          color: [0, 0, 0, 0.7],
          width: 0.5
        },
        // since the arrow points down, you can set the angle to 180
        // to force it to point up (0 degrees North) by default
        angle: 180,
        size: 20
      },
      visualVariables: [
        {
          type: 'rotation', // indicates that symbols should be rotated based on value in field
          field: rotationAttribute, // field containing aspect values
          rotationType: 'geographic'
        }
      ]
    // tslint:disable-next-line: deprecation
    } as any as Renderer;


    // TODO change geovent server data to number values instead of string
    // color vriables do not accept string anymore
    if (stops && false) {
      (rotationRenderer as any).visualVariables = [
        ...(rotationRenderer as any).visualVariables,
        {...stops, field: ''}
      ];
    }

    if (labelFeature) {
      const expression = `$feature.${labelFeature}`;
      const labelClass = new LabelClass({
        labelExpressionInfo: { expression },
        labelPlacement: 'above-center',
        minScale: 5000,
        symbol: {
          type: 'text',  // autocasts as new TextSymbol()
          haloColor: 'white',
          haloSize: '1px',
          rotated: true,
          yoffset: -3,
          color: 'black',
          font: {
            size: 7
          },
        } as any
      }) as LabelClass;

      streamLayer.labelingInfo = [labelClass];
    }

    streamLayer.renderer = rotationRenderer;

    return streamLayer;

  }

  createStreamService(config: StreamConfig, id: string, queryParams= null) {
    const { url, visible = false, title, style, color = '#ef7f1a', setRotation = false, rotationAttribute, labelFeature, stops } = config;
    this.config = config;
    this.id =  id;
    this.queryParams = queryParams;
    const streamParams = queryParams[id];
    this.map = this.mapService.returnMap();
    this.stream = this.addStream(url, visible, title, style, color, setRotation, rotationAttribute, labelFeature, stops, id);
    this.map.add(this.stream);
    this.setLayerView(this.stream, streamParams);
  }

  setLayerView(stream: StreamLayer, streamParams: string) {
    stream.on('layerview-create', (event) => {
      if (streamParams) {
        this.setdefaultVisibility(event.layerView.layer, streamParams);
      }
      //  yes event.layerView is actual StreamLayerView with all properties and methods
      this.streamLayerView = event.layerView as StreamLayerView;

      // add watch
      this.addWatchProperty('stationary');

    });
  }

  setdefaultVisibility(layer, streamParams: string) {
    // the stream services has only one layer if it is included, layer must be visible
    if (streamParams.split('!').includes('0')) {
      layer.visible = true;
    }
  }

  disconnectSocket() {
    this.timeoutID = setTimeout(() => {
      // connect / disconnect methods are removed from future API, as listening was moved to webworkers
      // TODO remove layers instead of disconnecting
      // this.streamLayerView.disconnect();
      this.streamSuspended = true;

      if (this.streamLayerView) {
        this.stream.destroy();
        this.map.remove(this.stream);
        this.stream = null;
        this.streamLayerView = null;
      }

    }, 1000 * 60 * 10); // 10 min
  }

  clearTimeOut() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = null;
    }

  }

  removeStream(fn= null) {
    if (this.streamLayerView) {
      // this.streamLayerView.disconnect();
      this.stream.destroy();
      this.map.remove(this.stream);
      this.stream = null;
      this.streamLayerView = null;
    }
    if (fn) {
      fn();
    }

  }

  destroy() {
    // ceck strema because we calling destrou on every Destroy
    if (this.stream) {
      this.clearTimeOut();
      this.removeStream();
      this.removeHandles();
      this.config = null;
      this.id = null;
      this.streamSuspended = false;
    }

  }


  addWatchProperty(prop: string) {
    const mapView = this.mapService.getView();
    this.disconnectSocket();

    mapView.when((view) => {
      const handle = view.watch(prop, (value: boolean) => {
        // renew disconnection every time and clear previous timers
        this.clearTimeOut();
        this.disconnectSocket();

        if (this.streamSuspended) {
          this.renewStreamLayer();
        }

      });

      this.watchHandles.push(handle);
    });


  }

  renewStreamLayer() {
    this.clearTimeOut();
    this.removeHandles();

    this.createStreamService(this.config, this.id, this.queryParams);
    this.streamSuspended = false;

  }

  removeHandles(): void {
    this.watchHandles.forEach(handle => {
      handle.remove();
    });
    this.watchHandles = [];
  }

  getStreamLayerView(): StreamLayerView {
    return this.streamLayerView;
  }

}
