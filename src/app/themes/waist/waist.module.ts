import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WaistRoutingModule } from './waist-routing.module';
import { WaistComponent } from './waist.component';
import { WaistStatsComponent } from './waist-stats.component';

import { CountUpModule } from 'countup.js-angular2';

@NgModule({
  declarations: [WaistComponent, WaistStatsComponent],
  imports: [
    CommonModule,
    CountUpModule,
    WaistRoutingModule
  ]
})
export class WaistModule { }
