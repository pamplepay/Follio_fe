import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs';
import { LayoutLoadingService } from './layout-loading.service';

@Component({
  selector:    'app-layout-loading',
  templateUrl: './layout-loading.component.html',
  styleUrls:   [ './layout-loading.component.scss' ]
})
export class LayoutLoadingComponent implements OnInit {

  loading$: Observable<any> | null = null;

  type: any | null = null;
  data: any | null = null;

  isShow: boolean = false;

  constructor(
    private loadingService: LayoutLoadingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    // observable 가져온다!
    this.loading$ = this.loadingService.rxLoading();

    // alertService 에서 observable 구독합니다.(isShow => true or false)
    this.loading$.subscribe((result: any) => {
        const isShow = result.isShow;
        this.type = result.type;
        this.data = result.data;

        this.isShow = isShow;
        this.changeDetectorRef.detectChanges();
      }
    );
  }
}
