import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildingsRoutingModule } from './buildings-routing.module';
import { BuildingsComponent } from './buildings.component';
import { SharedModule } from '../../../app/shared.module';
import { SidebarBuildingsComponent } from '../../map-widgets/widgets/themes/buildings/sidebar-buildings.component';


@NgModule({
  declarations: [
    BuildingsComponent,
    SidebarBuildingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BuildingsRoutingModule
  ]
})
export class BuildingsModule { }
