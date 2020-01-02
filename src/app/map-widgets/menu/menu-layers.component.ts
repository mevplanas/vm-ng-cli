import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { MapService } from '../../core/services/map.service';
import { MenuService } from '../../core/services/menu/menu.service';
import { ToolsNameService } from './tools-name.service';
import { MAP_CONFIG } from '../../core/config/map.config';
import { Utils } from '../../core/services/utils/utils';

@Component({
  selector: 'maps-v-menu-layers',
  templateUrl: './menu-layers.component.html',
  styleUrls: ['./menu-layers.component.scss']
})
export class MenuLayersComponent implements AfterViewInit, OnDestroy {
  @ViewChild('list', { static: false }) list: ElementRef;
  name: string;
  isChecked = true;
  listWidget: any;
  viewCreateEvent: any;
  listEvent: any;
  hideFirstLayer = false;

  constructor(
    private mapService: MapService,
    private menuService: MenuService,
    private toolsNameService: ToolsNameService,
    @Inject(MAP_CONFIG) private config
  ) { }

  onHideFirstLayer(event: boolean) {
    this.hideFirstLayer = event;
  }

  toggleLayerVisibility(event) {
    this.isChecked = event;
    // tslint:disable-next-line: max-line-length
    this.isChecked ? this.mapService.returnFeatureLayers().map(feature => { feature.visible = true; }) : this.mapService.returnFeatureLayers().map(feature => { feature.visible = false; });
  }

  closeToggle() {
    window.location.hash = '#';
  }

  ngAfterViewInit() {
    // add temp delay to get layers change to Observable
    setTimeout(() => {
      this.name = this.config.themes.itvTheme.name;
    }, 400);

    // init layers list widget
    const mapView = this.mapService.getView();
    const map = this.mapService.returnMap();
    let initialLoad = true;
    let timeId;
    mapView.when((view) => {
      // reorder layers in map and view
      // allLayers layer must be always last in map array,
      // as we are hiding layer list manualy with css
      // as we will be using static component in theme
      this.viewCreateEvent = view.on('layerview-create', (event) => {
        const index = map.layers.items.length - 1;

        // reorder only if allLayers layer arrives before theme layers
        if (index > 0) {
          // const subLayer = map.findLayerById("allLayers");
          if (event.layer.id === 'allLayers') {
            event.layer.listMode = 'hide';
            this.hideFirstLayer = false;
          }

          // reorder stream layer if exist
          if (event.layer.type === 'stream') {
            map.reorder(event.layer, index);
          }

          if (timeId) {
            clearTimeout(timeId);
            timeId = null;
          }

          // simply activate :target speudo class with location href
          // calling on every event
          timeId = setTimeout(() => {
            Utils.setMenuLayersAnchor();
          }, 600);

        }

        if (index > 0 && initialLoad) {
          Utils.setMenuLayersAnchorOnPageLoad();
          initialLoad = false;
        }

        // set tool name Obs, to close tools boxes if opened
        this.toolsNameService.setCurentToolName('');
      });

      this.listWidget = this.mapService.initLayerListWidget(view, this.list.nativeElement);
      this.listEvent = this.listWidget.on('trigger-action', (event) => {
        this.mapService.updateOpacity(event);
      });
    });

  }

  ngOnDestroy() {
    this.listWidget.destroy();
    this.viewCreateEvent.remove();
    this.listEvent.remove();
  }

}

