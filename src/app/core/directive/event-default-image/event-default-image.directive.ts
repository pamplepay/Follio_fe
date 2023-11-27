import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Directive({
  selector: '[EventDefaultImage]'
})
export class EventDefaultImageDirective implements OnInit {
  @Input() eventId: number;

  constructor() {}

  @HostBinding('style.background') private background;

  ngOnInit(): void {
    const productUrl = environment.production === true ? '/static' : '';
    const index = (this.eventId % 6) + 1;
    const imageUrl = `url('${productUrl}/assets/images/event-0${index}.png')`;
    this.background = imageUrl;
  }
}
