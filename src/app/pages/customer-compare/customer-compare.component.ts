import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { DateHandler } from '../../core/handler/date-handler/date-handler';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../core/service/common/common.service';
import { ICommonInsurance } from '../../core/model/common.model';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { GlobalBlurHandler } from '../../core/handler/globar-blur-handler/globar-blur-handler';

@Component({
  selector:    'app-customer-analysis',
  templateUrl: './customer-compare.component.html',
  styleUrls:   [ './customer-compare.component.scss' ]
})
export class CustomerCompareComponent implements OnInit {
  nowDate: string;
  commonInsurance: ICommonInsurance;
  compare: any;
  yieldCount: number = 4;
  yieldChartData: number[];
  barLevel: number[] = [];
  isShare: boolean;
  private existingCaseListObj: any;
  private suggestCaseListObj: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService,
    private _commonService: CommonService,
    private _changeDetectRef: ChangeDetectorRef,
    private _toastService: LayoutToastService,
    private _clipboard: Clipboard,
  ) {
  }

  ngOnInit(): void {
    this.isShare = this._route.snapshot.params?.share;
    if (!this.isShare) {
      this._headerService.show();
    }
    this._footerService.show();

    this.nowDate = DateHandler.getNowDate('YYYY.MM.DD');

    this.compare = this._route.snapshot.data.compare;

    this.barLevel[0] = this.compare.monthly_existing_sum_premium >= this.compare.monthly_suggest_sum_premium ? 2 : 1;
    this.barLevel[1] = this.compare.monthly_existing_sum_premium > this.compare.monthly_suggest_sum_premium ? 1 : 2;
    this.barLevel[2] = this.compare.total_existing_sum_premium >= this.compare.total_suggest_sum_premium ? 4 : 3;
    this.barLevel[3] = this.compare.total_existing_sum_premium > this.compare.total_suggest_sum_premium ? 3 : 4;

    this.existingCaseListObj = this.compare.existing.case_list.reduce(((object, caseItem) => {
      object[caseItem.id] = caseItem;
      return object;
    }),{});

    this.suggestCaseListObj = this.compare.suggest.case_list.reduce(((object, caseItem) => {
      object[caseItem.id] = caseItem;
      return object;
    }),{});

    this._commonService.rxInsurance().subscribe(common => {
      this.commonInsurance = common;
      this._initCaseList();
      console.log('this.insuranceCommon', this.commonInsurance);
    });

    if (this.compare.total_calculate <= 0) {
      this.yieldCount = 0;
    }
    this.yieldChartData = this._makeYieldChartData();

  }

  onBack() {
    this._router.navigateByUrl('customer/'+ this.compare.customer.id);
  }

  private _initCaseList(): void {
    this.commonInsurance.analysis_categories.forEach(category => {
      category.sub_category_list.forEach(subCategory => {
        subCategory.detail_list.forEach(detail => {
          detail.existing = this.existingCaseListObj[detail.id]
          detail.suggest = this.suggestCaseListObj[detail.id]
        });
      })
    })

    this._changeDetectRef.detectChanges();
  }

  onMinusYieldCount() {
    if (!this.yieldChartData) {
      return;
    }

    if (this.yieldCount === 0) {
      return;
    }
    this.yieldCount -= 1;

    this.yieldChartData = this._makeYieldChartData();
    console.log('this.yieldChartData', this.yieldChartData);
    this._changeDetectRef.detectChanges();
  }

  onPlushYieldCount() {
    if (!this.yieldChartData) {
      return;
    }

    this.yieldCount += 1;

    this.yieldChartData = this._makeYieldChartData();
    console.log('this.yieldChartData', this.yieldChartData);
    this._changeDetectRef.detectChanges();
  }

  private _makeYieldChartData() {
    let yieldAmount = this.compare.total_calculate
    const result = [];
    if (this.compare.total_calculate > 0) {
      result.push(this.compare.total_calculate)
      new Array(50).fill(0).forEach((_, index) => {
        yieldAmount += yieldAmount * this.yieldCount * 0.01
        if ((index + 1) % 10 === 0) {
          result.push(Math.floor(yieldAmount))
        }
      })
    } else {
      result.push(0)
      new Array(50).fill(0).forEach((_, index) => {
        yieldAmount += yieldAmount * this.yieldCount * 0.01
        if ((index + 1) % 10 === 0) {
          result.push(0)
        }
      })
    }

    return result;
  }

  onCopyUrl() {
    GlobalBlurHandler.blur();
    let url = location.href
    if (url.indexOf('share') === -1) {
      url = url.replace('compare', 'compare/share');
    }
    this._clipboard.copy(url);
    this._toastService.alert('링크가 복사 되었습니다.');
  }

  onGotoAnalysis(insuranceItem) {
    let url = '';
    if (insuranceItem.is_template) {
      url = 'template/'+insuranceItem.id + '/analysis';
    } else {
      url = 'insurance/'+insuranceItem.id + '/analysis';
    }

    if (this.isShare) {
      url = url + '/share';
    }

    this._router.navigateByUrl(url);
  }

  onClickCustomer(id) {
    if (this['isShare']) {
      return;
    }

    this._router.navigateByUrl(`customer/${id}`);
  }

  onGotoCustomerList() {
    if (this['isShare']) {
      return;
    }

    this._router.navigateByUrl('customer');
  }
}
