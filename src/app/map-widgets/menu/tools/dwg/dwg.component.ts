import { Component, AfterViewInit, Input, ChangeDetectorRef, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolsNameService } from '../../tools-name.service';
import { DwgService } from './dwg.service';
import { ToolsList } from '../../tools.list';
import { MAP_CONFIG } from '../../../../core/config/map.config';

@Component({
  selector: 'maps-v-dwg',
  templateUrl: './dwg.component.html',
  styleUrls: ['./dwg.component.scss']
})
export class DwgComponent implements AfterViewInit {
  @Input() tool: string;
  @Input() title: string;
  toolActive = false;
  icon = '';
  s: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private toolsNameService: ToolsNameService,
    private dwgs: DwgService,
    @Inject(MAP_CONFIG) private config
    ) { }

  toggleExtract() {
    this.toolActive = !this.toolActive;
    if (this.toolActive) {
      // reatatch chnage detaction when we open tool
      this.cdr.reattach();

      // set tool name Obs
      this.toolsNameService.setCurentToolName(this.tool);
      this.dwgs.setTool(this.tool);

      this.s = this.toolsNameService.currentToolName
        .subscribe((name) => {
          if (this.tool !== name) { this.closeMeasure(); }
        });
    } else {
      this.closeMeasure();
    }

  }

  closeMeasure() {
    this.toolActive = false;
    if (this.s) {
      this.s.unsubscribe();
    }

    //  detach changes detection
    // and last time detect changes when closing tool
    this.cdr.detach();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    if (this.tool === ToolsList.dwg) {
      this.icon = this.config.mapOptions.staticServices.extractDWG.icon;

    } else {
      this.icon = this.config.mapOptions.staticServices.extractDWGTech.icon;
    }
    this.cdr.detectChanges();
    this.cdr.detach();
  }

}
