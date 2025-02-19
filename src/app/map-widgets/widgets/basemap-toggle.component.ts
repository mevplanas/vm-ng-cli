import { Component, OnInit, Input } from "@angular/core";
import { BasemapsService } from "../../core/services/widgets/basemaps.service";
import View from "arcgis-js-api/views/View";

@Component({
  selector: "maps-v-basemap-toggle",
  templateUrl: "./basemap-toggle.component.html",
  styleUrls: ["./basemap-toggle.component.scss"],
})
export class BasemapToggleComponent implements OnInit {
  @Input() view: View;

  selectedValue: string;

  basemaps: any[];

  constructor(private basemapsService: BasemapsService) {
    this.basemaps = this.basemapsService.returnBasemaps();
  }

  toggleBasemap(id: string) {
    this.basemapsService.toggleBasemap(id, this.view);
  }

  ngOnInit() {
    this.selectedValue = this.basemapsService.returnActiveBasemap();
    this.basemapsService.filterBasemap(
      this.basemapsService.returnActiveBasemap(),
      this.view
    );
  }
}
