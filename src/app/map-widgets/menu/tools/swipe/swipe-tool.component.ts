import { Component } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { SwipeToolService } from './swipe-tool.service';
import { MapService } from 'src/app/core/services/map.service';
import { ToolsNameService } from '../../tools-name.service';
import { debounceTime, takeUntil, tap, filter } from 'rxjs/operators';
import { ToolsList } from '../../tools.list';

// id for raster layer in projects theme
export const projectRasterLayerID = 'projects-mil';

@Component({
  selector: 'maps-v-swipe-tool',
  templateUrl: './swipe-tool.component.html',
  styleUrls: ['./swipe-tool.component.scss']
})
export class SwipeToolComponent {
  toolActive = false;
  s: Subscription;
  b: Subscription;
  stop$: Observable<string>;

  constructor(
    private sts: SwipeToolService,
    private ms: MapService,
    private toolsNameService: ToolsNameService
  ) { }

  toggleSwipe() {
    this.toolActive = !this.toolActive;
    if (this.toolActive) {
      // destroy tool component if other component containing draw tool got opened
      this.s = this.toolsNameService.currentToolName.pipe(
        debounceTime(1000),
        takeUntil(this.toolsNameService.currentToolName.pipe(
          filter(name => ToolsList.swipe !== name),
          tap(() => {
            setTimeout(() => {
              this.removeRasterLayer();
              this.toolActive = false;
              this.sts.closeSwipe();
            });
          })
        ))
      )
        .subscribe(() => {
          this.sts.toggleSwipe(this.toolActive);
        });

      // set tool name Obs
      this.toolsNameService.setCurentToolName(ToolsList.swipe);
    }

    if (!this.toolActive) {
      if (this.s) {
        this.sts.closeSwipe();
        this.removeRasterLayer();
        this.s.unsubscribe();
        this.s = null;
      }

    }

  }

  removeRasterLayer() {
    // remove layer
    const map = this.ms.returnMap();
    const layer = map.findLayerById(projectRasterLayerID);

    if (layer) {
      map.remove(layer);
    }

  }

}

