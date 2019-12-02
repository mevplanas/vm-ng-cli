import { Component, OnInit, Inject } from '@angular/core';

import values from 'lodash-es/values';
import { MAP_CONFIG } from 'src/app/core/config/map.config';

@Component({
  selector: 'maps-v-menu-themes',
  templateUrl: './menu-themes.component.html',
  styleUrls: ['./menu-themes.component.scss']
})
export class MenuThemesComponent implements OnInit {
  themes: any[];

  constructor(@Inject(MAP_CONFIG) private config) {}

  closeToggle() {
    window.location.hash = '';
  }

  ngOnInit() {
    this.themes = values(this.config.themes);
  }

}
