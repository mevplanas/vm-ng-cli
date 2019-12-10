import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import Draw from 'arcgis-js-api/views/draw/Draw';
import { MatStepper } from '@angular/material/stepper';
import { MapService } from '../../../../core/services/map.service';
import PolygonDrawAction from 'arcgis-js-api/views/draw/PolygonDrawAction';
import { ExtractService } from './extract.service';
import isEmpty from 'lodash-es/isempty';
import { leaveEnterTransition } from 'src/app/core/animations/leaveEnter-transition';

@Component({
  selector: 'maps-v-extract-container',
  animations: [leaveEnterTransition],
  templateUrl: './extract-container.component.html',
  styleUrls: ['./extract-container.component.scss']
})
export class ExtractContainerComponent implements OnInit, OnDestroy {
  // dojo draw events handlers Array
  private eventHandlers = [];

  private drawActive = false;

  subscription: Subscription;
  view: any;
  draw: Draw;
  extracDisabled = true;
  isLinear = false;

  @ViewChild('stepper', {static: true}) stepper;
  @ViewChild('stepFirst', {static: true}) stepFirst: MatStepper;
  @ViewChild('stepSecond', {static: true}) stepSecond: MatStepper;

  constructor(
    private mapService: MapService,
    private cdr: ChangeDetectorRef,
    private extractService: ExtractService,
  ) {
    // this.cdr.detach();
  }

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
      this.cdr.detectChanges();
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

    this.cdr.detectChanges();

  }

  // add step logic after draw complete event
  addStep(step: MatStepper) {
    this.stepper.selected = step;
    this.stepper.selected.completed = true;
    this.isLinear = true;
    this.stepper.next();
    // this.cdr.detectChanges();
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
      if (this.extractService.calculatedUnits < 15) {
        this.addStep(this.stepFirst);
        this.toggleDraw();
        // this.cdr.detectChanges();
      }

      this.removeEventHandlers();
    }));
  }


  toggleExtractBtn(): void {
    this.extracDisabled = !this.extracDisabled;
    this.cdr.detectChanges();
  }

  initExtract(): void {
    this.toggleExtractBtn();
    this.extractService.submitExtractJob().then(() => {
      this.addStep(this.stepSecond);
      this.toggleExtractBtn();
    },
      (err) => { console.error(err); });

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
  }

  // remove eventHandlers
  removeEventHandlers() {
    this.eventHandlers.forEach((event) => {
      event.remove();
    });
    this.eventHandlers = [];
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.extractService.cancelJob();
    this.resetTools();
  }

}
