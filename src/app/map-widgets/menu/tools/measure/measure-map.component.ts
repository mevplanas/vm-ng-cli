import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MeasureMapService } from './measure-map.service';
import { ToolsNameService } from '../../tools-name.service';
import { ToolsList } from '../../tools.list';
import { MapService } from '../../../../core/services/map.service';

@Component({
  selector: 'maps-v-measure-map',
  templateUrl: './measure-map.component.html',
  styleUrls: ['./measure-map.component.scss']
})
export class MeasureMapComponent implements OnInit, AfterViewInit {
  public measureActive = false;

  // checking if first theme was inisiated before
  // if true, create new input data based on new theme
  firstThemeLoaded = false;
  s: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private mapService: MapService,
    private measureMapService: MeasureMapService,
    private toolsNameService: ToolsNameService
  ) { }

  toggleMeasure() {
    this.measureActive = !this.measureActive;

    if (this.measureActive) {
      // reatatch chnage detaction when we open tool
      this.cdr.reattach();

      // set tool name Obs
      this.toolsNameService.setCurentToolName(ToolsList.measure);

      // destroy tool component if other component containing draw tool got opened
      this.s = this.toolsNameService.currentToolName
        .subscribe((name) => {
          // console.log(this.s, 'Name M', name)
          if (ToolsList.measure !== name) {
            // TODO refactor, currently using setTimeout for ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => {
              this.closeMeasure();
            });
          }
        });
    } else {
      this.closeMeasure();
    }

  }

  closeMeasure() {
    this.measureActive = false;
    if (this.s) {
      this.s.unsubscribe();
    }

    //  detach changes detection
    // and last time detect changes when closing tool
    this.cdr.detach();
    this.cdr.detectChanges();
  }

  ngOnInit() {
    const view = this.mapService.getView();
    view.when((mview) => {
      mview.on('layerview-create', (event) => {
        // wait for last layer to be loaded then init createInputsData
        if (!this.firstThemeLoaded) {
          if (event.layer.id === 'allLayers') {
            // create buffer inputs data
            this.firstThemeLoaded = true;
          }

        } else {
          // create buffer inputs based on new theme
          this.measureMapService.createInputsData(event.layer);
        }

      });
    });
  }

  ngAfterViewInit() {
    this.cdr.detach();
  }

}
