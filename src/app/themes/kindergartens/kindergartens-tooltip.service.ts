import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { EsriEvent, EsriPointerEvent } from '../../core/models/esri-event';
import MapView from 'arcgis-js-api/views/MapView';
import { Subject } from 'rxjs';

@Injectable()

export class KindergartensTooltipService {
  parentNode: ElementRef;
  tooltipEvent: EsriEvent;

  // tooltip dom
  tooltip: any;

  constructor() { }

  addTooltip(view: MapView, element: ElementRef, rend: Renderer2, dataStore): void {
    const tooltip = rend.createElement('div');
    this.tooltip = tooltip;
    this.parentNode = element;

    this.tooltipEvent = view.on('pointer-move', (event) => {
      const screenPoint = {
        // hitTest BUG, as browser fails to execute 'elementFromPoint' on 'Document'
        // FIXME bug with x coordinate value, when menu icon is in view, temp solution: change x value from 0 to any value
        x: event.x ? event.x : 600,
        y: event.y
      };

      if (tooltip.textContent.length > 0) {
        // tooltip.textContent = '';
        // rend.setStyle(tooltip, 'padding', '0px');
      };

      view.hitTest(screenPoint)
        .then((response) => {
          if (response.results.length > 0) {
            // tslint:disable-next-line: max-line-length
            if ((response.results[0].graphic.layer.id === 'feature-darzeliai') && (response.results[0].graphic.layer.id !== 'feature-area')) {
              const top = (event.y + 100) < window.innerHeight ? event.y + 10 + 'px' : event.y - 30 + 'px';
              const left = (event.x + 100) < window.innerWidth ? event.x + 20 + 'px' : (event.x - 80) + 'px';
              const values = response.results['0'];
              const filter = dataStore.mainInfo.filter(data => data.GARDEN_ID === values.graphic.attributes.Garden_Id);
              const textMsg = filter[0].LABEL;
              const text = rend.createText(textMsg);
              tooltip.textContent = textMsg;
              rend.appendChild(element.nativeElement, tooltip);
              rend.addClass(tooltip, 'buldings-tooltip')
              rend.setStyle(tooltip, 'top', top);
              rend.setStyle(tooltip, 'left', left);
              rend.setStyle(tooltip, 'display', 'block');
              rend.setStyle(tooltip, 'padding', '5px');
              rend.setProperty(document.body.style, 'cursor', 'pointer');
            } else {
              tooltip.textContent = '';
              rend.setStyle(tooltip, 'display', 'none');
              rend.setProperty(document.body.style, 'cursor', 'auto');
            }

          } else {
            tooltip.textContent = '';
            rend.setStyle(tooltip, 'display', 'none');
            rend.setProperty(document.body.style, 'cursor', 'auto');
          }

        });
    });
  }

  clearMemoryAndNodes(rend) {
    if (this.tooltipEvent) {
      this.tooltipEvent.remove();
    }

    rend.removeChild(this.parentNode, this.tooltip);
  }

}
