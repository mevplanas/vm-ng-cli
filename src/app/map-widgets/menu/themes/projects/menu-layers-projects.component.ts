import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MapService } from 'src/app/core/services/map.service';
import { ToolsNameService } from '../../tools-name.service';
import { Utils } from 'src/app/core/services/utils/utils';
import { MAP_CONFIG } from 'src/app/core/config/map.config';

@Component({
  selector: 'maps-v-menu-layers-projects',
  templateUrl: './menu-layers-projects.component.html',
  styleUrls: ['./menu-layers-projects.component.scss']
})
export class MenuLayersProjectsComponent implements OnInit, OnDestroy {
  name: string;
  isChecked = true;
  viewCreateEvent: any;

  constructor(
    private mapService: MapService,
    private toolsNameService: ToolsNameService,
    @Inject(MAP_CONFIG) private config
  ) { }

  toggleLayerVisibility(event) {
    // or use [change]="isChecked" and (change)="toggleLayerVisibility($event)" with event.target.value instead
    this.isChecked = event;
    this.mapService.setLayersStatus(this.isChecked);

    // NEW approach
    const map = this.mapService.returnMap();
    this.isChecked ? map.findLayerById('itv-projects').visible = true : map.findLayerById('itv-projects').visible = false;
  }

  closeToggle() {
    window.location.hash = '#';
  }

  ngOnInit() {
    // add temp delay to get layers chnage to Observable
    setTimeout(() => {
      this.name = this.config.themes.itvTheme.name;
    }, 400);

    // TODO remove boilerplate in menu-layers-itv and menu-layers
    // init layers list widget
    const view = this.mapService.getView();
    const map = this.mapService.returnMap();
    let initialLoad = true;
    // console.log('OnInit Layers')
    view.when(() => {
      // reorder layers in map and view
      // allLayers layer must be always last in map array,
      // as we are hiding layer list manualy with css
      // as we will be using static component in theme
      this.viewCreateEvent = view.on('layerview-create', (event) => {
        // console.log('ONN', this.listWidget)
        const index = map.layers.items.length - 1;
        // reorder only if allLayers layer comes before theme layers
        if (index > 0) {
          const subLayer = map.findLayerById('allLayers');
          if (typeof subLayer !== undefined) {
            map.reorder(subLayer, index);
            // simply activate :target speudo class with location href
            Utils.setMenuLayersAnchor();
          }

        }
        if (index > 0 && initialLoad) {
          Utils.setMenuLayersAnchorOnPageLoad();
          initialLoad = false;
        }

        // set tool name Obs, to close tools boxes if opened
        this.toolsNameService.setCurentToolName('');
      });

    });
  }

  ngOnDestroy() {
    this.viewCreateEvent.remove();
  }

}
