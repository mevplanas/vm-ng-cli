import { Component, OnInit, Input } from '@angular/core';
import { MapService } from 'src/app/core/services/map.service';
import Compass from 'arcgis-js-api/widgets/Compass';

@Component({
  selector: 'maps-v-compass',
  templateUrl: './compass.component.html',
  styleUrls: ['./compass.component.scss']
})
export class CompassComponent implements OnInit {
  @Input() view: any;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    const compass = new Compass({
      view: this.view
    });

    // adds the compass to the top left corner of the MapView
    this.view.ui.add(compass, 'top-right');
  }

}
