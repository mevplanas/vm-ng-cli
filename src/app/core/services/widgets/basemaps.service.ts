import { Injectable, Inject } from "@angular/core";

import Basemap from "arcgis-js-api/Basemap";

import { MapService } from "../map.service";
import { BASEMAPS } from "../../models/basemaps.model";
import { MAP_CONFIG } from "../../config/map.config";

@Injectable({
  providedIn: "root",
})
export class BasemapsService {
  // DEFAULT basemap
  activeBasemap = "base-dark";

  constructor(
    private mapService: MapService,
    @Inject(MAP_CONFIG) private config
  ) {}

  returnBasemaps(): Basemap[] {
    return BASEMAPS;
  }

  setActiveBasemap(name: string) {
    this.activeBasemap = name;
  }

  toggleBasemap(id: string, view: any) {
    this.activeBasemap = id;
    this.filterBasemap(id, view);
  }

  returnActiveBasemap() {
    return this.activeBasemap;
  }

  // iniatiate basemaps
  initBasemaps(map, queryParams = { basemap: null }) {
    // add  basemap layer
    const basemaps = [];

    BASEMAPS.forEach((basemap) => {
      // Skip adding base-orto to the basemap widget

      const baseMapRestEndpoint =
        this.config.mapOptions.staticServices[basemap.serviceName];
      if (queryParams.basemap === basemap.id) {
        this.setActiveBasemap(basemap.id);
        const visibleBaseMap = this.mapService.initTiledLayer(
          baseMapRestEndpoint,
          basemap.id
        );
        basemaps.push(visibleBaseMap);
      } else {
        const hiddenBaseMap = this.mapService.initTiledLayer(
          baseMapRestEndpoint,
          basemap.id,
          false
        );
        basemaps.push(hiddenBaseMap);
      }
    });
    map.basemap = this.mapService.customBasemaps(basemaps);
    return basemaps;
  }

  // add current basemap visibilty
  filterBasemap(activeBasemMapId: string, view: any) {
    view.map.basemap.baseLayers.items.map((item) => {
      if (item.id === activeBasemMapId) {
        item.visible = true;

        // Toggle dark mode for "base-dark"
        activeBasemMapId === "base-dark"
          ? (document.getElementsByClassName("container-fluid")[0].className +=
              " dark")
          : document
              .getElementsByClassName("container-fluid")[0]
              .classList.remove("dark");
      } else {
        item.visible = false;

        // If active base map is base-en-t, also make "base-dark" visible
        if (this.activeBasemap === "base-en-t" && item.id === "base-dark") {
          item.visible = true;
        }

        // If active base map is base-en-s, also make "base-map" visible
        if (this.activeBasemap === "base-en-s" && item.id === "base-map") {
          item.visible = true;
        }

        // If active base map is base-imagery, also make "base-dark" visible
        if (this.activeBasemap === "base-imagery" && item.id === "base-orto") {
          item.visible = true;
        }
      }
    });
  }
}
