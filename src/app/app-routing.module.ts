import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { MapViewComponent } from './core/components/map-view/map-view.component';

import { environment } from '../environments/environment';
import forIn from 'lodash-es/forIn';
import { CONFIG } from './core/config/config';

const defaultThemesRoutes =  [];

function addDefaultRoutes() {
  forIn(CONFIG.themes, ( layer: any) => {
    if (!layer.custom && layer.production ) {
      const id = layer.id;
      defaultThemesRoutes.push({ path: id, loadChildren: () => import('./themes/default/default.module').then(m => m.DefaultModule) });
    }
  });
}

addDefaultRoutes();

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  // See RoutingService where we push all default childres routes from config file
  { path: '', component: MapViewComponent, children: [
    // { path: 'transportas', loadChildren: () => import('./themes/default/default.module').then(m => m.DefaultModule ) },
    { path: 'pastatai', loadChildren: () => import('./themes/buildings/buildings.module').then(m => m.BuildingsModule ) },
    { path: 'projektai', loadChildren: () => import('./themes/projects/projects.module').then(m => m.ProjectsModule ) },
    { path: 'darzeliai', loadChildren: () => import('./themes/kindergartens/kindergartens.module').then(m => m.KindergartensModule ) }
  ] }
];

// add development routes
if (!environment.production) {
  routes[1] = {
    path: '', component: MapViewComponent, children: [
      ...routes[1].children,
      { path: 'atlieku-tvarkymas', loadChildren: () => import('./themes/waist/waist.module').then(m => m.WaistModule ) }
    ]
  };

}

// add rest routes
routes[1] = {
  path: '', component: MapViewComponent, children: [
    ...routes[1].children,
    ...defaultThemesRoutes
  ]
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
