import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapService } from '../../../../core/services/map.service';

@Component({
  selector: 'maps-v-menu-legend-projects',
  templateUrl: './menu-legend-projects.component.html',
  styleUrls: ['./menu-legend-projects.component.scss']
})
export class MenuLegendProjectsComponent implements OnInit, OnDestroy {
  itvLayers: any;

  subscription: Subscription;
  // layerlists checkbox status (on or off)
  // status is Subject<boolean>
  status: any = true;

  constructor(private mapService: MapService) { }

  closeToggle() {
    window.location.hash = '#';
  }

  ngOnInit() {
    this.subscription = this.mapService.layersStatus.subscribe(status => {
      this.status = status;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

