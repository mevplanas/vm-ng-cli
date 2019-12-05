import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';

import { NgxPopperModule } from 'ngx-popper';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { RgbaColorDirective } from './map-widgets/widgets/themes/buildings/rgba-color.directive';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    RgbaColorDirective
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
    PerfectScrollbarModule,
    NgxPopperModule.forRoot({})
  ],
  exports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
    PerfectScrollbarModule,
    NgxPopperModule,
    RgbaColorDirective
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
      ]
    }
  }
}
