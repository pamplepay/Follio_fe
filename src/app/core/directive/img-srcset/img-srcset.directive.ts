import { Directive, ElementRef, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Directive({
  selector: '[imgSrcset]'
})
export class ImgSrcsetDirective implements OnInit {
  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (this.el?.nativeElement?.src) {
      const srcSplitList = this.el.nativeElement.src.split('/');
      const srcSliceList = srcSplitList.slice(3);
      const src = '/' + srcSliceList.join('/');
      const srcSplitDotList = src.split('.');
      const fileType = srcSplitDotList.splice(-1, 1);
      const fileUrl = srcSplitDotList.join('.');
      this.el.nativeElement.srcset = `${src} 400w, ${fileUrl}@2x.${fileType} 700w, ${fileUrl}@3x.${fileType} 1000w`;
    }
  }
}
