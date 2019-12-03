import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'maps-v-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {
  year = new Date();

  constructor() { }

  ngOnInit() {
  }

}
