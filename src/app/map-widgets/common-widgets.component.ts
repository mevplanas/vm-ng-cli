import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'maps-v-common-widgets',
  templateUrl: './common-widgets.component.html',
  styleUrls: ['./common-widgets.component.scss']
})
export class CommonWidgetsComponent implements OnInit {
  @Input() view: any;

  constructor() { }

  ngOnInit() {
  }

}
