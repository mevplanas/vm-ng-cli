import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';
import { KindergartensService } from './kindergartens.service';
import { KindergartensTooltipService } from './kindergartens-tooltip.service';
import { KindergartensLayersService } from './kindergartens-layers.service';
import { KindergartensComponent } from './kindergartens.component';
import { KindergartensRoutingModule } from './kindergartens-routing.module';
import { SidebarKindergartensComponent } from '../../map-widgets/widgets/themes/kindergartens/sidebar-kindergartens.component';
import { SearchKindergartensComponent } from '../../map-widgets/widgets/themes/kindergartens/search-kindergartens.component';
import { SelectorsService } from '../../map-widgets/widgets/themes/kindergartens/selectors.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    KindergartensRoutingModule
  ],
  declarations: [
    KindergartensComponent,
    SidebarKindergartensComponent,
    SearchKindergartensComponent
  ],
  providers: [KindergartensService, KindergartensTooltipService, KindergartensLayersService, SelectorsService]
})
export class KindergartensModule {

}
