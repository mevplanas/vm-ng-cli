import { Component } from '@angular/core';
import { MapService } from 'src/app/core/services/map.service';

@Component({
  selector: 'maps-v-locate-center',
  templateUrl: './locate-center.component.html',
  styleUrls: ['./locate-center.component.scss']
})
export class LocateCenterComponent {

  constructor(private mapService: MapService) { };

  centerMap() {
    this.mapService.centerMapWithCompass();
  }

}
