import { Component, OnInit } from '@angular/core';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth/auth.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(
    private _headerService: LayoutHeaderService,
    private _authService: AuthService,
    private _router: Router,
    private _footerService: LayoutFooterService
  ) { }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();
  }

  onClickStart() {
    if (this._authService.checkLogin()) {
      return;
    }
  }
}
