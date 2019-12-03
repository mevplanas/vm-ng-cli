import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolsNameService } from '../../tools-name.service';
import { ToolsList } from '../../tools.list';

@Component({
  selector: 'maps-v-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss']
})
export class ExtractComponent implements AfterViewInit {
  public toolActive = false;
  s: Subscription;

  constructor(private cdr: ChangeDetectorRef, private toolsNameService: ToolsNameService) { }

  toggleExtract() {
    this.toolActive = !this.toolActive;
    if (this.toolActive) {
      // reatatch chnage detaction when we open tool
      this.cdr.reattach();

      // set tool name Obs
      this.toolsNameService.setCurentToolName(ToolsList.extract);

      this.s = this.toolsNameService.currentToolName
        .subscribe((name) => {
          if (ToolsList.extract !== name) { this.closeMeasure(); }
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
    this.cdr.detach();
  }

}

