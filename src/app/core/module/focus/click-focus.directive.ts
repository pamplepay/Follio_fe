import { Directive, HostListener, Input } from '@angular/core';
import { FocusService } from './focus.service';

/*
* click 이벤트에서 미리 입력받은 focusName 을 focusService 에 설정합니다.
* */
@Directive({
  selector: '[redcapxClickFocus]'
})
export class ClickFocusDirective {

  @Input('redcapxClickFocus') focusName: string = '';

  @HostListener('click', ['$event']) onClick(event: Event) {
    if (!this.focusName) {
      return;
    }

    event.stopPropagation();

    const focusName = this.focusService.getFocus();
    if (this.focusName === focusName) {
      this.focusService.setFocus(null);

    } else {
      this.focusService.setFocus(this.focusName);
    }
  }

  constructor(private focusService: FocusService) { }


}
