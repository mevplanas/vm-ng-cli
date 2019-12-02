import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonWidgetsComponent } from './common-widgets.component';
import { BasemapToggleComponent } from './widgets/basemap-toggle.component';
import { CompassComponent } from './widgets/compass.component';
import { CreditsComponent } from './widgets/credits.component';
import { LocateCenterComponent } from './widgets/locate-center.component';
import { MaintenanceComponent } from './widgets/maintenance.component';
import { ScaleLogoComponent } from './widgets/scale-logo.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { MenuLayersComponent } from './menu/menu-layers.component';
import { MenuLegendComponent } from './menu/menu-legend.component';
import { MenuSubLayersComponent } from './menu/menu-sub-layers.component';
import { MenuThemesComponent } from './menu/menu-themes.component';
import { MenuToolsComponent } from './menu/menu-tools.component';
import { MenuComponent } from './menu/menu.component';
import { ProfileContainerComponent } from './menu/tools/profile/profile-container.component';
import { ProfileElevationComponent } from './menu/tools/profile/profile-elevation.component';
import { ProfileToolContainerComponent } from './menu/tools/profile/profile-tool-container.component';
import { ProfileToolComponent } from './menu/tools/profile/profile-tool.component';
import { SwipeToolComponent } from './menu/tools/swipe/swipe-tool.component';
import { SwipeToolContainerComponent } from './menu/tools/swipe/swipe-tool-container.component';
import { SwipeContainerComponent } from './menu/tools/swipe/swipe-container.component';

@NgModule({
  declarations: [
    CommonWidgetsComponent,
    BasemapToggleComponent,
    CompassComponent,
    CreditsComponent,
    LocateCenterComponent,
    MaintenanceComponent,
    ScaleLogoComponent,
    MenuLayersComponent,
    MenuLegendComponent,
    MenuSubLayersComponent,
    MenuThemesComponent,
    MenuToolsComponent,
    MenuComponent,
    ProfileContainerComponent,
    ProfileElevationComponent,
    ProfileToolContainerComponent,
    ProfileToolComponent,
    SwipeToolComponent,
    SwipeToolContainerComponent,
    SwipeContainerComponent
  ],
  exports: [CommonWidgetsComponent],
  imports: [
    SharedModule
  ]
})
export class MapWidgetsModule { }
