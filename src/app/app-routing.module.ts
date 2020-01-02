import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { MapViewComponent } from './core/components/map-view/map-view.component';

import { environment } from '../environments/environment';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  // See RoutingService where we push all default childres routes from config file
  { path: '', component: MapViewComponent, children: [
    { path: 'pastatai', loadChildren: () => import('./themes/buildings/buildings.module').then(m => m.BuildingsModule ) },
    { path: 'projektai', loadChildren: () => import('./themes/projects/projects.module').then(m => m.ProjectsModule ) }
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
