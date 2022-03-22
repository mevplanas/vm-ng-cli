import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapService } from '../../core/services/map.service';
import { IdentifyService } from '../../core/services/identify.service';
import { ProjectsListService } from './projects-list/projects-list.service';
import { PointAddRemoveService } from './point-add-remove.service';

@Injectable()
export class FeatureQueryService {
  // deactivated theme filter properties, created and updated dinamycally (on click)
  // example: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true};
  private deactivatedThemeFilters: any;
  // theme filter fiters properties, created and updated dinamycally
  private deactivatedYearFilters: any;

  private expressionSQL = {
    theme: [],
    year: []
  };
  private expressionCommon = {
    theme: [],
    year: []
  };
  // pass expression to map component for list filtering based on active filters
  private expressionToMapComponent: string;

  // Observable  source, start from empty ("") string
  private expressionStObs = new BehaviorSubject<any>('');
  // Observable item stream
  expressionItem = this.expressionStObs.asObservable();

  constructor(
    private mapService: MapService,
    private identify: IdentifyService,
    private projectsService: ProjectsListService,
    private pointAddRemoveService: PointAddRemoveService
    ) { }

  // create years Object from years for filtering  by year or
  // create themes Object from themes for filtering  by theme
  sendToMap(years: string[], themes: number[]) {
    // console.log("REDUCE: ", years.reduce((acc, cur, i) => {acc[cur] = true; return acc;}, {}) )
    this.deactivatedThemeFilters = themes.reduce((acc, cur) => { acc[cur.toString()] = true; return acc; }, {});
    this.deactivatedYearFilters = years.reduce((acc, cur) => { acc[cur] = true; return acc; }, {});
  }

  // service command
  changeExpression(expression) {
    this.expressionStObs.next(expression);
  }

  // return current SQL expression string which is set by UI filters
  getExpression() {
    return this.expressionToMapComponent;
  }

  getExpressionSQL() {
    // console.log("expression", this.expressionSQL);
    return this.expressionSQL;
  }

  // check if result has filter properties
  checkResult(expressionSQL, result) {
    let gotResult = false;
    if ((expressionSQL.theme.length === 0) && (expressionSQL.year.length === 0)) {
      gotResult = true;
    } else if ((expressionSQL.theme.length > 0) && (expressionSQL.year.length > 0)) {
      let hasTheme = false;
      let hasYear = false;
      for (const theme of expressionSQL.theme) {
        if (theme == result.feature.attributes.TemaID) {
          hasTheme = true;
          break;
        }
      }
      for (const year of expressionSQL.year) {
        if (year === result.feature.attributes.Igyvend_IKI.slice(0, 4)) {
          hasYear = true;
          break;
        }
      }
      if (hasTheme && hasYear) {
        gotResult = true;
      }
    } else if ((expressionSQL.theme.length > 0) && (expressionSQL.year.length === 0)) {
      for (const theme of expressionSQL.theme) {
        if (theme == result.feature.attributes.TemaID) {
          gotResult = true;
          break;
        }
      }
    } else {
      for (const year of expressionSQL.year) {
        if (year === result.feature.attributes.Igyvend_IKI.slice(0, 4)) {
          gotResult = true;
          break;
        }
      }
    }
    return gotResult;
  }

  // filter by theme
  filterFeatures(theme: number) {
    if (this.deactivatedThemeFilters[theme.toString()]) {
      let expression;
      let expressionFinal: string;

      // push theme to array
      this.expressionSQL.theme.push(theme);

      // filter by TemaID
      expression = this.getFilterQuery(this.expressionSQL.theme, 'TemaID', '=');

      // change common expression
      this.expressionCommon.theme[0] = expression;
      expressionFinal = this.runDefinitionExpression('theme', 'year');

      this.mapService.returnFeatureLayers().map(feature => {
        feature.definitionExpression = expressionFinal;
      });
      this.deactivatedThemeFilters[theme.toString()] = false;

      this.filterDynamicMaps(expressionFinal);
    } else {
      // get indexof theme and remove it
      const index = this.expressionSQL.theme.indexOf(theme);
      let expression;
      let expressionFinal: string;
      if (index > -1) {
        this.expressionSQL.theme.splice(index, 1);
      }
      // filter by TemaID
      expression = this.getFilterQuery(this.expressionSQL.theme, 'TemaID', '=');
      // change common expression
      this.expressionCommon.theme[0] = expression;
      expressionFinal = this.runDefinitionExpression('theme', 'year');
      this.mapService.returnFeatureLayers().map(feature => {
        feature.definitionExpression = expressionFinal;
      });
      this.deactivatedThemeFilters[theme.toString()] = true;

      this.filterDynamicMaps(expressionFinal);
    }

  }

  // filter dynamic layer by definitionExpression and SQL query by theme and year
  filterDynamicMaps(expression: any) {
    const projectsLayer = this.mapService.getProjectsDynamicLayer();
    projectsLayer.sublayers.forEach(sublayer => {
      sublayer.definitionExpression = expression;
    });

  }

  getFilterStatusTheme() {
    return this.deactivatedThemeFilters;
  }
  getFilterStatusYear() {
    return this.deactivatedYearFilters;
  }

  // run definition by specific expression depended on first and second filters
  // for example: first filter is themes and second filter is years
  runDefinitionExpression(firstFilter: string, secondFilter: string) {
    if (this.expressionCommon[secondFilter].length > 0) {
      // if string is empty, like ""
      if ((this.expressionCommon[firstFilter][0].length > 0) && (this.expressionCommon[secondFilter][0].length > 0)) {
        // tslint:disable-next-line: max-line-length
        this.expressionToMapComponent = '(' + this.expressionCommon[firstFilter][0] + ') AND (' + this.expressionCommon[secondFilter][0] + ')';
        this.changeExpression('(' + this.expressionCommon[firstFilter][0] + ') AND (' + this.expressionCommon[secondFilter][0] + ')');
        return '(' + this.expressionCommon[firstFilter][0] + ') AND (' + this.expressionCommon[secondFilter][0] + ')';
      } else if (((this.expressionCommon[secondFilter][0].length > 0) && (this.expressionCommon[firstFilter][0].length === 0))) {
        this.expressionToMapComponent = this.expressionCommon[secondFilter][0];
        this.changeExpression(this.expressionCommon[secondFilter][0]);
        return this.expressionCommon[secondFilter][0];
      } else {
        // alert(2)
        this.expressionToMapComponent = this.expressionCommon[firstFilter][0];
        this.changeExpression(this.expressionCommon[firstFilter][0]);
        return this.expressionCommon[firstFilter][0];
      }
    } else {
      this.expressionToMapComponent = this.expressionCommon[firstFilter][0];
      this.changeExpression(this.expressionCommon[firstFilter][0]);
      return this.expressionCommon[firstFilter][0];
    }
  }

  getFilterQuery(expressionArray: Array<any>, property: string, operator: string) {
    let queryStringClause = '';
    for (let i = 0; i < expressionArray.length; i += 1) {
      if (expressionArray[i]) {
        if ((expressionArray.length - 1 - i) === 0) {
          if (operator === '=') {
            queryStringClause += property + operator + '' + expressionArray[i] + '';
          } else {
            queryStringClause += property + operator + '\'%' + expressionArray[i] + '%\'';
          }
        } else if ((expressionArray.length) === 0) {
          queryStringClause += '';
        } else {
          // if theme filter
          if (operator === '=') {
            queryStringClause += property + operator + '' + expressionArray[i] + ' OR ';
          } else {
            // else year filter
            queryStringClause += property + operator + '\'%' + expressionArray[i] + '%\' OR ';
          }
        }
      }
    }
    return queryStringClause;
  }

  // filter by year
  yearFilterQuery(year) {
    if (this.deactivatedYearFilters[year]) {
      let expression;
      let expressionFinal: string;
      // push theme to array
      this.expressionSQL.year.push(year);
      expression = this.getFilterQuery(this.expressionSQL.year, 'Igyvend_IKI', ' LIKE ');
      // change common expression
      this.expressionCommon.year[0] = expression;
      expressionFinal = this.runDefinitionExpression('year', 'theme');
      this.mapService.returnFeatureLayers().map(feature => {
        feature.definitionExpression = expressionFinal;
      });
      this.deactivatedYearFilters[year] = false;

      this.filterDynamicMaps(expressionFinal);
    } else {
      // get indexof theme and remove it
      const index = this.expressionSQL.year.indexOf(year);
      let expression;
      let expressionFinal: string;
      if (index > -1) {
        this.expressionSQL.year.splice(index, 1);
      }
      expression = this.getFilterQuery(this.expressionSQL.year, 'Igyvend_IKI', ' LIKE ');
      // change common expression
      this.expressionCommon.year[0] = expression;
      expressionFinal = this.runDefinitionExpression('year', 'theme');
      this.mapService.returnFeatureLayers().map(feature => {
        feature.definitionExpression = expressionFinal;
      });
      this.deactivatedYearFilters[year] = true;

      this.filterDynamicMaps(expressionFinal);
    }
  }

  // identify projects return deffered object with results, init popup and selection graphics
  identifyProjects(projectsDynamicLayer, identifyParams, map, view, uniqueListItemId = 0) {
    return this.identify.identify(projectsDynamicLayer.url).execute(identifyParams).then((response) => {
      // return only 1 result, TODO remove map method and logic, as we wil identify only one result
      let results;
      if (!uniqueListItemId) {
        results = response.results.slice(0, 1);
      } else {
        // in filter compare number with string
        results = response.results.filter(result => {
          return result.feature.attributes.UNIKALUS_NR === uniqueListItemId.toString();
        });
      }

      if ((results.length > 0) && (projectsDynamicLayer.visible)) {
        // tslint:disable-next-line: variable-name
        let number = 0;
        // check results for geometry type
        const geometryTypes: any = {
          hasPoint: false, // every project will have point geometry by default
          hasLine: false,
          hasPolygon: false
        };
        // filter result by the last object (or active filters) and its unique id
        let uniqueID;
        let uniqueIdCount = 0;
        projectsDynamicLayer.sublayers.items.filter(layer => {
          results.forEach(result => {
            const expressionSQL = this.getExpressionSQL();
            // tslint:disable-next-line: max-line-length
            if ((((layer.id === result.layerId) && (layer.maxScale < view.scale) && (view.scale < layer.minScale)) || ((layer.id === result.layerId) && (layer.minScale === 0))) && (this.checkResult(expressionSQL, result)) && (uniqueIdCount === 0)) {
              if (uniqueListItemId && (uniqueListItemId == result.feature.attributes.UNIKALUS_NR)) {
                uniqueID = result.feature.attributes.UNIKALUS_NR;
                // add geometry type to check if we clicked on point then proceed
                if (result.feature.geometry.type === 'point') { geometryTypes.hasPoint = true; }
                if  (result.feature.geometry.rings) { geometryTypes.hasPolygon = true; }
                if (result.feature.geometry.paths) { geometryTypes.hasLine = true; }
                uniqueIdCount += 1;
              } else {
                // if was not defined (only if item was clicked on list) add unique number
                if (!uniqueID) {
                  uniqueID = result.feature.attributes.UNIKALUS_NR;
                }
                // add geometry type to check if we clicked on point then proceed
                if (result.feature.geometry.type === 'point') {
                  geometryTypes.hasPoint = true;
                }

                if (result.feature.geometry.rings) {
                  geometryTypes.hasPolygon = true;
                }
              }
            }
          });
        });

        // init if we click on point, then add graphics immediately
        return results.map(result => {
          // get filters SQL query
          const expressionSQL = this.getExpressionSQL();

          if ((uniqueID === result.feature.attributes.UNIKALUS_NR)) {

            const name = result.feature.attributes.Pavadinimas;
            const feature = result.feature;
            const layer = projectsDynamicLayer.sublayers.items.filter(layer => {
              if (layer.id === result.layerId) {
                return layer;
              }
            });
            // console.log("layer", layer);
            // add feature layer id
            feature.layerId = projectsDynamicLayer.id;
            // add sublayer id
            feature.subLayerId = result.layerId;

            // add selection graphic
            // if we did not catch point init identify by poly or Line (if polygon doesn't exist)
            // if (geometryTypes.hasPoint) {
            // start selection of graphics
            // this.pointAddRemoveService.showSelectionGraphicOnPoint(feature, this.map, this.view, this.projectsDynamicLayer, number);
            // we need to get point if we identify by clicking on list
            this.pointAddRemoveService.showSelectionGraphicCommon(feature, map, view, projectsDynamicLayer, number, geometryTypes);
            number += 1;
            // add only 1 feature, we do not need dublicate
            // only return feature for layers that is visible in current scale
            if (((layer['0'].maxScale < view.scale) && (view.scale < layer['0'].minScale)) || (layer['0'].minScale === 0)) {
              // return result based on activated filters
              if (this.checkResult(expressionSQL, result)) {
                // activate list from map element
                // TODO move to component
                this.projectsService.getFilterListName();

                feature.popupTemplate = {
                  title: `${name}`,
                  content: this.projectsService.getPopUpContent(result.feature.attributes)
                };
                return feature;
              }
            }
          }
        });
      }
    });
  }
}
