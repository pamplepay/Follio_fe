import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChildren } from '@angular/core';
import { WaitHandler } from '../../handler/wait-handler/wait-handler';

@Directive({
  selector: '[scrollToValue]'
})
export class ScrollToValueDirective implements OnInit, OnChanges {
  @Input() scrollToValue: string | null = null;
  @Input() scrollSelectorClass: string | null = null;

  childList: any;
  selectedElement: any;

  constructor(
    private el: ElementRef
  ) {
  }

  ngOnInit(): void {
    const currentElement:Element = this.el.nativeElement;
    WaitHandler.wait(() => {
      const childElementList = currentElement.getElementsByClassName(this.scrollSelectorClass);
      return childElementList.length === 0 ? null : childElementList;
    }, () => {
      this.childList = currentElement.getElementsByClassName(this.scrollSelectorClass);
      this.setScroll();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['scrollToValue'] && this.childList) {
      this.setScroll();
    }
  }

  setScroll(): void {
    Array.prototype.forEach.call(this.childList, (elementItem: Element) => {
      if (elementItem.textContent === this.scrollToValue) {
        this.selectedElement = elementItem;
      }
    });

    const currentElement:Element = this.el.nativeElement;
    if (currentElement) {
      currentElement.scrollTo({
        left: 0,
        top: this.selectedElement.offsetTop
      });
    }
  }

}
