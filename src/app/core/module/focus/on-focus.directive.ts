import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { FocusService } from './focus.service';
import { takeWhile } from 'rxjs/operators';

/*
* 포커스를 subscribe 하는 directive 로 적절한 위치에 directive 를 놓은뒤 예를들어 #focus="redcapFocus"로 변수에 할당받고
* focus.isFocus 를 확인해서 원하는 처리를 하면됩니다.
* */
@Directive({
  selector: '[redcapxOnFocus]',
  exportAs: 'redcapFocus'
})
export class OnFocusDirective implements OnInit, OnDestroy {
  @Input('redcapxOnFocus') focusName = '';

  @HostBinding('class.is-open') isOpen = false;

  isFocus: boolean = false;
  isUnsubscribe: boolean = false;

  constructor(
    private focusService: FocusService
  ) {
  }

  ngOnInit(): void {
    this.focusService.rxFocus()?.pipe(takeWhile(() => this.isUnsubscribe === false)).subscribe(focusName => {
      this.isFocus = this.focusName === focusName;
      this.isOpen = this.focusName === focusName;
    });
  }

  ngOnDestroy(): void {
    this.isUnsubscribe = true;
  }
}
