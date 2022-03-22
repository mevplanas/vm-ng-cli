import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MapService } from '../../core/services/map.service';

@Component({
  selector: 'maps-v-locate-center',
  templateUrl: './locate-center.component.html',
  styleUrls: ['./locate-center.component.scss']
})
export class LocateCenterComponent implements OnInit {
  @ViewChild('locate', { static: true }) locate: ElementRef;

  constructor(private mapService: MapService) { };

  ngOnInit(): void {
    const view = this.mapService.getView();
    view.ui.add(this.locate.nativeElement, {
      position: 'top-right'
    });
  }

  centerMap() {
    this.mapService.centerMapWithCompass();
  }

}
