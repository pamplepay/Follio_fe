import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-check-email-modal',
  templateUrl: './check-email-modal.component.html',
  styleUrls: ['./check-email-modal.component.scss']
})
export class CheckEmailModalComponent implements OnInit {
  @Input() email: string = 'email@email.com';
  @Output() dismiss = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dismiss.emit();
  }

}
