import { Component, OnInit } from '@angular/core';
import { RoutingService } from './core/services/routing.service';

@Component({
  selector: 'maps-v-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // constructor(private routingService: RoutingService) {}

  ngOnInit() {
    // this.routingService.addDefaultRoutes();
  }
}
