import { Component, OnInit } from '@angular/core';
import { FocusService } from '../../core/module/focus/focus.service';
import { LayoutFooterService } from './layout-footer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout-footer',
  templateUrl: './layout-footer.component.html',
  styleUrls: ['./layout-footer.component.scss']
})
export class LayoutFooterComponent implements OnInit {
  footer$: Observable<boolean>;

  constructor(
    private focusService: FocusService,
    private footerService: LayoutFooterService
  ) { }

  ngOnInit(): void {
    this.footer$ = this.footerService.rxFooter();
  }

  onClickSite(url): void {
    this.focusService.setFocus(null);

    if (url !== '') {
      window.open(url, '_blank');
    }
  }
}
