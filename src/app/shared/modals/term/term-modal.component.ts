import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-term-modal',
  templateUrl: './term-modal.component.html',
  styleUrls: ['./term-modal.component.scss']
})
export class TermModalComponent implements OnInit {
  @Output() dismiss = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dismiss.emit();
  }


}
