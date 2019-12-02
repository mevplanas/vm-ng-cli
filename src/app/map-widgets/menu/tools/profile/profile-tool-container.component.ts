import { Component, OnInit } from '@angular/core';
import { ProfileToolService } from './profile-tool.service';

@Component({
  selector: 'maps-v-profile-tool-container',
  templateUrl: './profile-tool-container.component.html',
  styleUrls: ['./profile-tool-container.component.scss']
})
export class ProfileToolContainerComponent {

  constructor(public profileToolService: ProfileToolService) { }

  closeMeasure() {
    this.profileToolService.closeProfile();
  }

}
