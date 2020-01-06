import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

import forIn from 'lodash-es/forIn';
import { MAP_CONFIG } from '../config/map.config';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(
    private router: Router,
    @Inject(MAP_CONFIG) private config
  ) { }

  addDefaultRoutes() {
    forIn(this.config.themes, (layer) => {
      if (!layer.custom && layer.production ) {
        const id = layer.id;
        // tslint:disable-next-line: max-line-length
        this.router.config[1].children.push({ path: id, loadChildren: () => import('../../themes/default/default.module').then(m => m.DefaultModule)
        });
      }
    });
  }

}
