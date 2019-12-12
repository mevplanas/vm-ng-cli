import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaistComponent } from './waist.component';


const routes: Routes = [
  { path: '', component: WaistComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaistRoutingModule { }
