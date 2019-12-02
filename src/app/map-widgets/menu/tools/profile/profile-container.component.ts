import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ProfileElevationComponent } from './profile-elevation.component';
import Draw from 'arcgis-js-api/views/draw/Draw';
import { ProfileToolService } from './profile-tool.service';
import PolylineDrawAction from 'arcgis-js-api/views/draw/PolylineDrawAction';
import isEmpty from 'lodash-es/isempty';
import { MapService } from '../../../../core/services/map.service';

@Component({
  selector: 'maps-v-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss']
})
export class ProfileContainerComponent  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(ProfileElevationComponent, {static: false}) pEC;
  private drawActive = false;

  // dojo draw events handlers Array
  private eventHandlers = [];
  chartData: any;
  isFullScreen = false;
  view: any;
  draw: Draw;
  hasError = false;
  updatingChart = false;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private mapService: MapService,
    private profileToolService: ProfileToolService
  ) { }

  ngOnInit() {
    this.view = this.mapService.getView();

    // add draw capabilities for temporary geometries
    this.view.when(() => {
      this.draw = this.profileToolService.initDraw(this.view);
      this.profileToolService.initGeoprocessor(this.view);
    });
  }

  ngAfterViewInit() {
    this.cdr.detach();
  }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.cdr.detectChanges();
  }

  toggleDraw() {
    this.drawActive = !this.drawActive;
  }

  selectDrawEl(): void {
    // order is important
    this.toggleDraw();

    // if button was active (after taggle becomes false)
    // button behaves as reset button and starts to draw
    if (!this.drawActive) {

      this.enableCreatePolyline();
      this.toggleDraw();
    } else {
      // important
      this.cdr.detectChanges();

      this.pEC.resetChart();
      this.hasError = false;
      this.view.graphics.removeAll();

      // TODO implement ssuspend hitTest of feature layers
      this.mapService.suspendLayersToggle();
      this.enableCreatePolyline();
    }

  }

  // Polygon approach
  enableCreatePolyline(): void {
    // create() will return a reference to an instance of PolygonDrawAction
    const action = this.draw.create('polygon');

    // focus the view to activate keyboard shortcuts for drawing polygons
    this.view.focus();

    this.zone.runOutsideAngular(() => {


      // listen to vertex-add event on the action
      this.eventHandlers.push(action.on('vertex-add', (e) => this.profileToolService.createPolylineGraphic(e)));

      // listen to cursor-update event on the action
      this.eventHandlers.push(action.on('cursor-update', (e) => this.profileToolService.createPolylineGraphic(e)));

      // listen to vertex-remove event on the action
      this.eventHandlers.push(action.on('vertex-remove', (e) => this.profileToolService.createPolylineGraphic(e)));

      // listen to draw-complete event on the action
      this.eventHandlers.push(action.on('draw-complete', (e) => {
        this.updatingChart = true;

        this.profileToolService.createPolylineGraphic(e, true).then((result) => {
          this.zone.run(() => {
            this.updatingChart = false;
            if (result.details && (result.details.httpStatus === 400)) {
              this.hasError = true;
              this.chartData = null;
            } else {
              this.hasError ? this.hasError = false : this.hasError;
              this.chartData = result;
            }
          });

          // important
          this.cdr.detectChanges();
        });
        this.toggleDraw();
        this.removeEventHandlers();

        // important
        this.cdr.detectChanges();
      }));

    });
  }

  // remove eventHandlers
  removeEventHandlers() {
    this.eventHandlers.forEach((event) => {
      event.remove();
    });
    this.eventHandlers = [];
  }

  resetTools() {
    // complete 2d draw action since 4.5 complete() method is available
    const action = this.draw.activeAction as PolylineDrawAction;

    if (!isEmpty(action)) {
      action.complete();

      // BUG Fix: in order to unsuspend run destroy as well
      // BUG effects if we closing draw feature after first draw element has been added
      action.destroy();

      this.draw.activeAction = null;
    }

    this.view.graphics.removeAll();

    // reset eventHandler events
    this.removeEventHandlers();

    // unsuspend layers
    if (this.mapService.getSuspendedIdentitication()) {
      this.mapService.unSuspendLayersToggle();
    }

  }

  ngOnDestroy() {
    this.resetTools();
  }

}
