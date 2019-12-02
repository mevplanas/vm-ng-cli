import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileToolService } from './profile-tool.service';
import { ToolsNameService } from '../../tools-name.service';
import { ToolsList } from '../../tools.list';
import { takeUntil, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'maps-v-profile-tool',
  templateUrl: './profile-tool.component.html',
  styleUrls: ['./profile-tool.component.scss']
})
export class ProfileToolComponent implements OnInit {
  toolActive = false;
  s: Subscription;

  constructor(
    public profileToolService: ProfileToolService,
    private toolsNameService: ToolsNameService
  ) { }

  toggleMeasure() {
    this.toolActive = this.profileToolService.toggleProfile();

    if (this.toolActive) {
      // set tool name Obs
      this.toolsNameService.setCurentToolName(ToolsList.profile);

      // destroy tool component if other component containing draw tool got opened
      this.s = this.toolsNameService.currentToolName.pipe(
        takeUntil(this.toolsNameService.currentToolName.pipe(
          filter(name => ToolsList.profile !== name),
          tap(() => {
            setTimeout(() => {
              this.toolActive = this.profileToolService.closeProfile();
              this.toolActive = false;
            });
          })
        ))
      ).subscribe(() => '');
    } else {
      if (this.s) {
        this.s.unsubscribe();
      }

    }

  }

  ngOnInit() {
  }

}
