import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MapService } from '../../core/services/map.service';
import { MenuService } from '../../core/services/menu/menu.service';

@Component({
  selector: 'maps-v-menu-sub-layers',
  templateUrl: './menu-sub-layers.component.html',
  styleUrls: ['./menu-sub-layers.component.scss']
})
export class MenuSubLayersComponent implements OnInit {
  @Output() hideFirstLayer = new EventEmitter<boolean>();
  state = false;

  constructor(
    private mapService: MapService,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.menuService.subLayersActivation.subscribe((isActivated) => {
      this.reorder(isActivated);
    });
  }


  reorder(isActivated: boolean) {
      // kind of hackish, wee need to reorder layers because we hiding first layer in main layers menu
      // and showing first layer in sublayers menu
      const map = this.mapService.returnMap();
      const index = map.layers.items.length - 1;
      const layer = map.findLayerById('allLayers');
      map.reorder(layer, 0);

      if (map) {
        const layer = map.findLayerById('allLayers');
        if (isActivated) {
          layer.listMode = 'show';
          this.hideFirstLayer.emit(true)

        } else {
          layer.listMode = 'hide';
          this.hideFirstLayer.emit(false)
        }


      }

  }

  toggleSubState() {
    const subLayersSate = this.menuService.getSubLayersState();

    // add sublayers if allLayers group layer is not fully defined
    if (!subLayersSate) {
      // change subLayersState (only on first init)
      this.menuService.setSubLayersState();
      this.reorder(subLayersSate);

      const map = this.mapService.returnMap();
      const allLayerGroup = this.mapService.getAllLayers();
      const layer = map.findLayerById('allLayers');
      layer.sublayers.removeAll();
      layer.sublayers.addMany(allLayerGroup);

    } else {
      this.hideFirstLayer.emit(false)
    }

    this.menuService.toggleSubListState();
    // open help box if it was closed
    if (this.menuService.getVisibleSubLayerNumberState()) {
      this.menuService.setVisibleSubLayerNumberState(1);
    }

    this.state = this.menuService.getSubState();
  }

}
