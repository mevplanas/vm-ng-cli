import { Component, OnInit, Input } from '@angular/core';
import ScaleBar from 'arcgis-js-api/widgets/ScaleBar';
import MapView from 'arcgis-js-api/views/MapView';

@Component({
  selector: 'maps-v-scale-logo',
  templateUrl: './scale-logo.component.html',
  styleUrls: ['./scale-logo.component.scss']
})
export class ScaleLogoComponent implements OnInit {
  @Input() view: MapView;

  ngOnInit() {
    const scaleBar = new ScaleBar({
      view: this.view,
      unit: 'dual'
    });

    this.view.ui.add(scaleBar, {
      position: 'bottom-left'
    });
  }

}
