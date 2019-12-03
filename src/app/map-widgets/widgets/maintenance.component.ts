import { Component, OnInit, Inject } from '@angular/core';
import { MAP_CONFIG } from 'src/app/core/config/map.config';

@Component({
  selector: 'maps-v-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent {
  message = this.config.maintenance.msg;
  constructor(@Inject(MAP_CONFIG) private config) { }

}
