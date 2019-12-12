import { Component, OnChanges, Input, ChangeDetectorRef } from '@angular/core';
import { MapService } from 'src/app/core/services/map.service';

@Component({
  selector: 'maps-v-waist-stats',
  templateUrl: './waist-stats.component.html',
  styleUrls: ['./waist-stats.component.scss']
})
export class WaistStatsComponent implements OnChanges {
  @Input() content: any;
  nextDay = ' ';

  constructor(private cdr: ChangeDetectorRef, private mapService: MapService) {
  }

  ngOnChanges() {
    this.createQuery('https://atviras.vplanas.lt/arcgis/rest/services/Testavimai/Konteineriu_isv_grafikai/MapServer/1');
  }

  doSomethingOnComplete() {

  }

  parseAmount(): number {
    return + this.content.graphic.attributes.Svoris_kg;
  }

  async createQuery(url) {
    const query = this.mapService.addQuery();
    const queryTask = this.mapService.addQueryTask(url);
    query.returnGeometry = false;
    query.where = `Konteinerio_Nr='${this.content.graphic.attributes.Konteinerio_Nr}'`;
    query.outFields = ['*'];
    const results = await queryTask.execute(query).then((result) => {
      return result;
    }, (error) => {
      console.error(error);
    });

    this.getNextDay(results);
  }

  getNextDay(result): void {
    // TODO add current date logic when date is null
    // tslint:disable-next-line: max-line-length
    const currentDate = this.content.graphic.attributes.Pakelimo_data_laikas_V_short ? this.content.graphic.attributes.Pakelimo_data_laikas_V_short : '2019-03-17';
    const dates = result.features.map((feature => feature.attributes.Planuojama_isvezimo_data_V_striped)).sort();
    if (dates.indexOf(currentDate) + 1) {
      const newDate = dates[dates.indexOf(currentDate) + 1];
      this.nextDay = newDate ? newDate : '-';
      // console.log('next day',dates, dates.indexOf(currentDate + 1), this.nextDay);

    } else {
      const nDates = [...dates, currentDate].sort();
      const newDate = nDates[nDates.indexOf(currentDate) + 1];
      this.nextDay = newDate ? newDate : '-';
    }
    this.cdr.detectChanges();
  }

}
