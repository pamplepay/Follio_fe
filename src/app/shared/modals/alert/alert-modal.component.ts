import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector:    'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls:   ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit {
  @Input() title = '타이틀';
  @Input() width = '320px';
  @Input() body = '내용';
  @Input() btnConfirmName = '확인';
  @Input() btnCancelName = '취소';
  @Input() isConfirm = false;
  @Input() isPrimary = false;
  @Input() isRecent = false;
  @Input() isLink = false;
  @Output() dismiss = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();
  @Output() link = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (this.isLink) {
      setTimeout(() => {
        document.getElementsByClassName('show-link')[0].addEventListener('click', () => {
          this.link.emit();
        });
      },100);
    }

  }

  onClose(): void {
    this.dismiss.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
