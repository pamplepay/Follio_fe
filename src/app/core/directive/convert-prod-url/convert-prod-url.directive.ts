import { Directive, ElementRef, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Directive({
  selector: '[convertProdUrl]'
})
export class ConvertProdUrlDirective implements OnInit {
  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (environment.production) {
      // http://capsule.redcapx.com/assets/images/chicken.jpeg => http://capsule.redcapx.com/static/assets/images/chicken.jpeg
      if (this.el.nativeElement.srcset && this.el.nativeElement.srcset !== '') {
        this.el.nativeElement.srcset = this.el.nativeElement.srcset.replace(/\/assets\//g, '/static/assets/');
      }

      const splitString = this.el.nativeElement.src.split('/');
      splitString.splice(3, 0, 'static');
      const recoveryUrl = splitString.join('/');
      this.el.nativeElement.src = recoveryUrl;
    }

  }
}
