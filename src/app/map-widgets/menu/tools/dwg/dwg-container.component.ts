import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Draw from 'arcgis-js-api/views/draw/Draw';
import { MatStepper } from '@angular/material/stepper';
import { MapService } from '../../../../core/services/map.service';
import { DwgService } from './dwg.service';
import PolygonDrawAction from 'arcgis-js-api/views/draw/PolygonDrawAction';
import isEmpty from 'lodash-es/isempty';
import { leaveEnterTransition } from '../../../../core/animations/leaveEnter-transition';

@Component({
  selector: 'maps-v-dwg-container',
  animations: [leaveEnterTransition],
  templateUrl: './dwg-container.component.html',
  styleUrls: ['./dwg-container.component.scss']
})
export class DwgContainerComponent implements OnInit, OnDestroy {
  // dojo draw events handlers Array
  private eventHandlers = [];
  public drawActive = false;
  public gpError = false;
  public progressBarValue = 0;

  subscription: Subscription;
  view: any;
  draw: Draw;
  extracDisabled = true;
  isLinear = false;

  @ViewChild('stepper', {static: true}) stepper;
  @ViewChild('stepFirst', {static: true}) stepFirst: MatStepper;
  @ViewChild('stepSecond', {static: true}) stepSecond: MatStepper;

  @HostListener('window:beforeunload')
  beforeUnloadEvent() {
    this.extractService.cancelJob();
  }

  constructor(
    private mapService: MapService,
    private cdr: ChangeDetectorRef,
    public extractService: DwgService,
  ) { }

  ngOnInit() {
    // set previuos step uneditable
    this.subscription = this.stepper.selectionChange.subscribe((stepper) => {
      stepper.previouslySelectedStep.editable = false;
    });

    this.view = this.mapService.getView();

    // add draw capabilities for temporary geometries
    this.view.when(() => {
      this.draw = this.extractService.initDraw(this.view);
      this.extractService.initGeoprocessor(this.view);
    });
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
      this.resetTools();
      this.enableCreatePolygon();
      this.toggleDraw();
    } else {
      // TODO implement ssuspend hitTest of feature layers
      this.mapService.suspendLayersToggle();
      this.enableCreatePolygon();
    }
  }

  // add step logic after draw complete event
  addStep(step: MatStepper) {
    this.stepper.selected = step;
    this.stepper.selected.completed = true;
    this.isLinear = true;
    this.stepper.next();
    this.cdr.detectChanges();
  }

  resetDraw(): void {
    this.stepper.reset();
  }

  // Polygon approach
  enableCreatePolygon(): void {
    // create() will return a reference to an instance of PolygonDrawAction
    const action = this.draw.create('polygon');

    // focus the view to activate keyboard shortcuts for drawing polygons
    this.view.focus();

    // listen to vertex-add event on the action
    this.eventHandlers.push(action.on('vertex-add', (e) => this.extractService.drawPolygon(e, this.drawActive)));

    // listen to cursor-update event on the action
    this.eventHandlers.push(action.on('cursor-update', (e) => this.extractService.drawPolygon(e, this.drawActive)));

    // listen to vertex-remove event on the action
    this.eventHandlers.push(action.on('vertex-remove', (e) => this.extractService.drawPolygon(e, this.drawActive)));

    // listen to draw-complete event on the action
    this.eventHandlers.push(action.on('draw-complete', (e) => {
      this.extractService.drawPolygon(e, this.drawActive, true);
      if (this.extractService.calculatedUnits < this.extractService.limits) {
        this.addStep(this.stepFirst);
        this.toggleDraw();
      }

      this.removeEventHandlers();
    }));
  }


  toggleExtractBtn(): void {
    this.extracDisabled = !this.extracDisabled;
  }

  initExtract(): void {
    this.toggleExtractBtn();
    this.setProgressBarValue();
    this.extractService.submitExtractJob().then((e) => {
      e ? this.gpError = false : this.gpError = true;

      this.addStep(this.stepSecond);
      this.toggleExtractBtn();

      this.resetProgressBarValue();
    });

  }

  setProgressBarValue(): void {
    this.progressBarValue = 0;
    // f.e.: if 10 min set, run every 3 s, for at least  9 min 30 s
    const interval = setInterval(() => {
      if (this.progressBarValue > 100 || this.extracDisabled || this.gpError) {
        this.gpError ? this.progressBarValue = 0 : this.progressBarValue = 100;
        clearInterval(interval);
      } else {
        if (this.progressBarValue < this.extractService.time) {
          // f.e.: if 10 min set, in 30 s set progress value to 10
          this.progressBarValue += 1 / this.extractService.time * 10;
        } else {
          this.progressBarValue += 1 / this.extractService.time * 5;
        }
      }
    }, 3000);
  }

  resetProgressBarValue(): void {
    this.progressBarValue = 0;
  }

  resetTools(): void {
    const action = this.draw.activeAction as PolygonDrawAction;

    if (!isEmpty(action)) {
      action.complete();

      // BUG Fix: in order to unsuspend run destroy as well
      // BUG effects if we closing draw feature after first draw element has been added
      action.destroy();

      this.draw.activeAction = null;
    }

    this.extracDisabled = true;
    this.extractService.graphic = null;
    this.extractService.calculatedUnits = null;
    this.drawActive = false;
    this.view.graphics.removeAll();
    this.stepper.reset();

    // reset eventHandler events
    this.removeEventHandlers();

    // unsuspend layers
    if (this.mapService.getSuspendedIdentitication()) {
      this.mapService.unSuspendLayersToggle();
    }

    this.gpError = false;
  }

  // remove eventHandlers
  removeEventHandlers() {
    this.eventHandlers.forEach((event) => {
      event.remove();
    });
    this.eventHandlers = [];
  }


  ngOnDestroy() {
    // detach to prevent change detection
    this.cdr.detach();

    this.subscription.unsubscribe();
    this.extractService.cancelJob();
    this.resetTools();
  }

}
