import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToolsList } from './tools.list';

@Component({
  selector: 'maps-v-menu-tools',
  templateUrl: './menu-tools.component.html',
  styleUrls: ['./menu-tools.component.scss']
})
export class MenuToolsComponent {
  @Input() currentTheme: string;
  // set  toolsActive to false in parent component and get back menu wrapper for mobile
  @Output() close = new EventEmitter<boolean>();

  toolList = ToolsList;

  closeToggle() {
    window.location.hash = '#';
    // emit close event
    this.close.emit(false);
  }

}
