import { Component, OnInit } from '@angular/core';

@Component({
  selector:    'app-btn-top',
  templateUrl: './btn-top.component.html',
  styleUrls:   [ './btn-top.component.scss' ]
})
export class BtnTopComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  onTop() {
    document.body.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onBottom() {
    document.body.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }
}
