import { Directive, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mapsVHideElements]'
})
export class HideElementsDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  // not using input at the moment
  @Input() active = true;

  parent: ElementRef;

  @HostListener('click')
  onClick() {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'none')
  }

}
