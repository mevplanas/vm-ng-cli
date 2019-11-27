import { Component, OnInit, Inject } from '@angular/core';

import values from 'lodash-es/values';
import { MAP_CONFIG } from '../../config/map.config';
import { themesTransition } from '../../animations/themes-transition';

@Component({
  selector: 'maps-v-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [ themesTransition ]
})
export class HomeComponent implements OnInit {
  themes: any[];

  constructor(@Inject(MAP_CONFIG) private config) { }

  ngOnInit() {
    this.themes = values(this.config.themes);
  }

}
