import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapViewComponent } from './core/components/map-view/map-view.component';
import { MAP_CONFIG } from './core/config/map.config';
import { HomeComponent } from './core/components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MapWidgetsModule } from './map-widgets/map-widgets.module';
import { HideElementsDirective } from './core/directives/hide-elements.directive';
import { SharedModule } from './shared.module';

import Raven from 'raven-js';
import { CONFIG } from './core/config/config';
import { environment } from '../environments/environment';

if (environment.production) {
  Raven
    .config(environment.sentry_dsn)
    .install();
}

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
  }
}

export function VilniusMapsErrorHandler() {
  if (environment.production) {
    return new RavenErrorHandler();
  } else {
    return new ErrorHandler();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    HomeComponent,
    HideElementsDirective,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MapWidgetsModule
  ],
  providers: [
    { provide: MAP_CONFIG, useValue: CONFIG },
    { provide: ErrorHandler, useFactory: VilniusMapsErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
