import Layer from 'arcgis-js-api/layers/Layer';
import LayerView from 'arcgis-js-api/views/layers/LayerView';

export interface EsriEvent {
  remove(): void;
}

export interface EsriPointerEvent {
  pointerId: number;
  pointerType: string;
  x: number;
  y: number;
  button: number;
  buttons: number;
  type: string;
  timestamp: number;
  native: object;
  stopPropagation(): void;
}

export interface LayerViewEvent {
  layer: Layer;
  layerView: LayerView;
}
