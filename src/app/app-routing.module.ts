import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { MapViewComponent } from './core/components/map-view/map-view.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  // See RoutingService where we push all default childres routes from config file
  { path: '', component: MapViewComponent, children: [
    { path: 'pastatai', loadChildren: () => import('./themes/buildings/buildings.module').then(m => m.BuildingsModule ) }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
