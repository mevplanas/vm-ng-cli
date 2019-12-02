import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu/menu.service';

@Component({
  selector: 'maps-v-menu-legend',
  templateUrl: './menu-legend.component.html',
  styleUrls: ['./menu-legend.component.scss']
})
export class MenuLegendComponent implements AfterViewInit, OnDestroy {
  @ViewChild('legend', { static: false }) legend: ElementRef;
  legendWidget: any;

  constructor(private menuService: MenuService) { }

  initLegend() {
    return this.menuService.fetchLegend(this.legend.nativeElement);
  }

  closeToggle() {
    window.location.hash = '#';
  }

  ngAfterViewInit() {
    this.legendWidget = this.initLegend();
  }

  ngOnDestroy() {
    this.legendWidget.destroy();
  }

}

