import { Directive, ElementRef, Input, OnInit } from '@angular/core';


/**
 * Icon representing priority 'very high' is only available pointing to the right.
 * So it needs to be rotated by -90 degress.
 */

@Directive({
  selector: '[appPrioIcon]'
})
export class PrioIconDirective implements OnInit {

  @Input() appPrioIcon: string;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.appPrioIcon === 'double_arrow') {
      this.el.nativeElement.style.transform = 'rotate(-90deg)';
    }
  }

}
