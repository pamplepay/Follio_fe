import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit
} from '@angular/core';
import { TOAST_ANIMATION_TIME } from '../layout-taost.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector:    'app-basic-toast',
  templateUrl: './basic-toast.component.html',
  styleUrls:   [ './basic-toast.component.scss' ],
  animations:  [
    trigger('enter_leave_animation', [
      transition(':enter', [
        style({ opacity: 0, zIndex:9999}),
        animate(TOAST_ANIMATION_TIME, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate(TOAST_ANIMATION_TIME, style({ opacity: 0, zIndex:9999 }))
      ])
    ])
  ]
})
export class BasicToastComponent implements OnInit {
  // Toast Required
  @Input() id: symbol;
  @Input() index: number = 0;

  // Data
  @Input() emoji: string;
  @Input() message: string;

  height: number = 48;
  padding: number = 10;

  isUnsubscribe: boolean = false;

  constructor() {
  }

  @HostBinding('@enter_leave_animation')


  ngOnInit(): void {
  }
}
