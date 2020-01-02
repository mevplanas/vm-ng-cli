import { trigger, transition, animate, style, state } from '@angular/animations';

export const sidebarAnimation =
  trigger('sidebarState', [
    state('s-close', style({
      transform: 'translateX(326px)'
    })),
    state('s-open', style({
      transform: 'translateX(0px)'
    })),
    transition('s-open => s-close', animate('100ms ease-in')),
    transition('s-close => s-open', animate('100ms ease-out'))
  ]
);
