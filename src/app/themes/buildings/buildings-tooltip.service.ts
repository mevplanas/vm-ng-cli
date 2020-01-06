import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EsriEvent } from 'src/app/core/models/esri-event';
import MapView from 'arcgis-js-api/views/MapView';

@Injectable({
  providedIn: 'root'
})
export class BuildingsTooltipService {
  parentNode: ElementRef;
  tooltipEvent: EsriEvent;

  // tooltip dom
  tooltip: any;

  constructor() { }

  addTooltip(view: MapView, element: ElementRef, rend: Renderer2) {
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

      view.hitTest(screenPoint)
        .then((response) => {
          // TEMP use address atribute for temp condition by showing only tooltip on buildings layer
          if (response.results.length > 0 && response.results[0].graphic.attributes.ADRESAS) {
            const newRsponse = response.results[0].graphic.attributes.ADRESAS;
            if (response !== newRsponse) {
              drawTooltip(response, event);
            }
            response = newRsponse;
          } else {
            tooltip.textContent = '';
            rend.setStyle(tooltip, 'display', 'none');
            rend.setProperty(document.body.style, 'cursor', 'auto');          }
        });
    });

    function drawTooltip(response, event) {
      rend.setProperty(document.body.style, 'cursor', 'pointer');

      // tslint:disable-next-line: max-line-length
      const top = (event.y + 100) < window.innerHeight ? window.innerHeight - event.y + 10 + 'px' : window.innerHeight - event.y - 30 + 'px';
      const left = (event.x + 100) < window.innerWidth ? event.x + 20 + 'px' : (event.x - 110) + 'px';
      // using 2 feature layers with different attributes
      const values = response.results[0] ? response.results[0] : response.results[1];
      // don't add tooltip in case of stop variable
      // or in case we hit graphic object with no attributes
      if (values.graphic.attributes) {
        // using 2 feature layers with different attributes
        const textMsg = values.graphic.attributes.ADRESAS ? `${values.graphic.attributes.ADRESAS}` : `${values.graphic.attributes.Pavad}`;

        tooltip.textContent = textMsg;
        rend.appendChild(element.nativeElement, tooltip);        rend.addClass(tooltip, 'buldings-tooltip');
        rend.setStyle(tooltip, 'transform', 'translate3d(' + left + ', -' + top + ', 0)');
        rend.setStyle(tooltip, 'padding', '5px');
        rend.setStyle(tooltip, 'display', 'block');
      } else {
        tooltip.textContent = '';
        rend.setStyle(tooltip, 'display', 'none');
        rend.setProperty(document.body.style, 'cursor', 'auto');
      }

    }

  }

  clearMemoryAndNodes(rend) {
    if (this.tooltipEvent) {
      this.tooltipEvent.remove();
    }

    rend.removeChild(this.parentNode, this.tooltip);
  }

}
