import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
} from "@angular/core";
import { MapService } from "../../../../core/services/map.service";
import { SearchService } from "../../../../core/services/search.service";
import Search from "arcgis-js-api/widgets/Search";

@Component({
  selector: "maps-v-search-kindergartens",
  template: `
    <div
      #searchWidgetDOM
      id="gartens-search-widget"
      class="gartens-search"
    ></div>
  `,
  styles: [
    `
      .gartens-search.esri-search {
        position: relative;
        z-index: 3;
      }
      .gartens-search .esri-widget--button,
      .gartens-search.esri-search .esri-search__container.esri-widget--button {
        display: none;
      }

      :host ::ng-deep div.esri-search__container .esri-search__submit-button {
        display: none;
      }
    `,
  ],
})
export class SearchKindergartensComponent implements AfterViewInit {
  @ViewChild("searchWidgetDOM", { static: false }) searchWidgetDOM: ElementRef;
  @Input() analyzeParams;

  searchWidget: Search;

  constructor(
    private mapService: MapService,
    private searchService: SearchService
  ) {}

  returnSerch() {
    return this.searchWidget;
  }

  ngAfterViewInit(): void {
    this.searchWidget = this.searchService.kindergartensSearchWidget(
      this.mapService.getView(),
      this.searchWidgetDOM.nativeElement,
      "Adresas, pvz.: Konstitucijos pr. 3"
    );

    this.searchWidget.on("search-focus", () => {
      // after each search block key enter search
      this.searchWidget.autoSelect = false;
    });
  }
}
