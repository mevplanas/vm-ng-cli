import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KindergartensComponent } from './kindergartens.component';

const routes: Routes = [
  { path: '', component: KindergartensComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KindergartensRoutingModule { }
