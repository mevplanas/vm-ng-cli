import { Injectable, Inject } from "@angular/core";
import { MapService } from "../../core/services/map.service";
import { MAP_CONFIG } from "../../core/config/map.config";

@Injectable({
  providedIn: "root",
})
export class DefaultService {
  dynamicLayersArray: any[] = [];
  urlArray: string[] = [];

  constructor(
    private mapService: MapService,
    @Inject(MAP_CONFIG) private config
  ) {}

  getUrls(): string[] {
    return this.urlArray;
  }

  // return Dynimac Layers
  initDefaultDynamicLayers(
    themeServiceUrl: any,
    id: string,
    name: string,
    opacity: number,
    raster: boolean = false
  ): any {
    const dynamicLayer = this.mapService.initDynamicLayer(
      themeServiceUrl,
      id,
      name,
      opacity
    );
    dynamicLayer.isRaster = raster;
    return dynamicLayer;
  }

  // get service based on theme
  getDefaultDynamicLayers(urlTheme: string) {
    const themes: any = this.config.themes;
    for (const theme in themes) {
      // if hasOwnProperty and if not custom theme
      if (themes.hasOwnProperty(theme) && !themes[theme].custom) {
        const themeId = themes[theme].id; // get unique theme id
        if (themeId === urlTheme) {
          return this.returnDynamicLayersArray(theme);
        }
      }
    }
  }

  returnDynamicLayersArray(themeId: string): any[] {
    const layers = this.config.themes[themeId].layers;
    const layersArr: any[] = [];
    for (const layer in layers) {
      if (layers.hasOwnProperty(layer)) {
        const url = layers[layer].dynimacLayerUrls;
        // init dynaimc layer bases on url and push it to array
        const id = layer; // get id
        const name = layers[layer].name; // get name
        const opacity = layers[layer].opacity;
        const raster = layers[layer].isRaster;
        // do not push service with Raster
        if (!raster) {
          this.urlArray.push(url);
        }

        layersArr.push(
          this.initDefaultDynamicLayers(url, id, name, opacity, raster)
        );
      }
    }

    return layersArr;
  }

  // Helper function to format dates
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // validate date string in multiple formats
  isValidDate(dateStr: string): boolean {
    const regEx1 = /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)$/;
    const regEx2 = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return dateStr.match(regEx1) !== null || dateStr.match(regEx2) !== null;
  }

  // parse date string in multiple formats
  parseDate(dateStr: string): Date {
    if (
      dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)$/)
    ) {
      const [datePart, timePart, period] = dateStr.split(" ");
      const [month, day, year] = datePart.split("/");
      let [hours, minutes, seconds] = timePart.split(":").map(Number);

      if (period === "PM" && hours < 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hours,
        minutes,
        seconds
      );
    } else if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const [month, day, year] = dateStr.split("/");
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      throw new Error("Invalid date format");
    }
  }

  // check if url is an image
  isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  // check if url is pdf document
  isPdf(url) {
    return /\.(pdf)$/.test(url);
  }

  findUrls(text) {
    const pdfIcon = window.location.origin + "/assets/img/pdf-icon.png";
    const imageIcon = window.location.origin + "/assets/img/image-icon.png";
    const externalIcon =
      window.location.origin + "/assets/img/external-icon.png";
    // find all urls in string
    const urlRegex =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const allUrls = text.replace(urlRegex, (url) => {
      console.log(url);

      const pdf = this.isPdf(url);
      const image = this.isImage(url);
      const getName =
        pdf || image ? url.split("/").pop().split(".")[0] : "Nuoroda";
      console.log("getName", getName);
      // const urlName = getName.length > 0 ? getName : "Nuoroda";
      return `<p style="display: flex; align-items: center"><img style="height: 20px; margin-right: 5px" src='${
        pdf === true ? pdfIcon : image === true ? imageIcon : externalIcon
      }' alt=""><a href='${url}' rel="noopener noreferrer" target='_blank'>${getName.replace(
        /_/g,
        " "
      )}</a></p>`;
    });

    return allUrls;
  }

  getVisibleLayersContent(result): string {
    const feature = result.feature;
    let content = " ";
    const layerName = result.layerName;
    const attributes = feature.attributes;

    feature.attributes.layerName = layerName;

    for (const resultAtr in attributes) {
      if (attributes.hasOwnProperty(resultAtr)) {
        // Filter specific string values
        // TEMP check for raster and other str properties, use match case insensitive where possible
        // tslint:disable-next-line: max-line-length
        if (
          !(
            resultAtr.toLowerCase() === "objectid" ||
            resultAtr === "layerName" ||
            resultAtr.match(/shape/i) ||
            resultAtr === "Class value" ||
            resultAtr === "Pixel Value" ||
            resultAtr.match(/count/i) ||
            resultAtr == "OBJECTID" ||
            resultAtr == "layerName" ||
            resultAtr == "SHAPE" ||
            resultAtr == "SHAPE.area" ||
            resultAtr == "OID" ||
            resultAtr == "Shape.area" ||
            resultAtr == "SHAPE.STArea()" ||
            resultAtr == "Shape" ||
            resultAtr == "SHAPE.len" ||
            resultAtr == "Shape.len" ||
            resultAtr == "SHAPE.STLength()" ||
            resultAtr == "SHAPE.fid" ||
            resultAtr === "Class value" ||
            resultAtr === "Pixel Value" ||
            resultAtr === "Count_"
          )
        ) {
          let attributeResult = attributes[resultAtr];
          // Check for valid date string
          if (this.isValidDate(attributeResult)) {
            const date = this.parseDate(attributeResult);
            content +=
              "<p><span>" +
              resultAtr +
              "</br></span>" +
              this.formatDate(date) +
              "<p>";
          } else {
            if (attributeResult !== null) {
              // attributes[resultAtr] == null  equals to (attributes[resultAtr]  === undefined || attributes[resultAtr]  === null)
              if (attributeResult === " " || attributeResult === "Null") {
                attributeResult = "-";
              }
            } else {
              attributeResult = "-";
            }
            // check if url contains http or https  + :// string with regex, TODO refactor
            if (attributeResult.match("^https?://", "i")) {
              // tslint:disable-next-line: max-line-length
              content += `<p><span>${resultAtr} </span > ${this.findUrls(
                attributeResult
              )}
                <p>`;
            } else {
              content +=
                "<p><span>" +
                resultAtr +
                "</br></span>" +
                attributeResult +
                "<p>";
            }
          }
        } else if (resultAtr === "Class value" || resultAtr === "Pixel Value") {
          // TEMP check for raster properties   and add custom msg
          content =
            '<p class="raster">Išsamesnė sluoksnio informacija pateikiama Meniu lauke <strong>"Žymėjimas"</strong></p>';
        }
      }
    }
    return content;
  }
}
