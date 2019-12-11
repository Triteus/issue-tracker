import { PrioIconDirective } from './prio-icon.directive';
import { ElementRef } from '@angular/core';

describe('PrioIconDirective', () => {
  it('should create an instance', () => {
    const nativeEl = document.createElement('div');
    const el = new ElementRef(nativeEl);
    const directive = new PrioIconDirective(el);
    expect(directive).toBeTruthy();
  });
});
