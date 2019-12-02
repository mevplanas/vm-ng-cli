import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { MapViewComponent } from './core/components/map-view/map-view.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: '', component: MapViewComponent, children: [] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
