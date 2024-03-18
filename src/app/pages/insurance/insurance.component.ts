import { Component, OnInit } from '@angular/core';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

  constructor(
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService
  ) { }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();

  }

}
