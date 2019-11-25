import { Component, OnInit } from '@angular/core';
import Map from 'arcgis-js-api/Map';

@Component({
  selector: 'maps-v-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vm-ng-cli';

  ngOnInit() {
    console.log(new Map());
  }
}
