import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { CommonService } from '../../core/service/common/common.service';
import { ICommonInsurance } from '../../core/model/common.model';
import { WaitHandler } from '../../core/handler/wait-handler/wait-handler';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { GlobalBlurHandler } from '../../core/handler/globar-blur-handler/globar-blur-handler';

@Component({
  selector:    'app-customer-analysis',
  templateUrl: './customer-analysis.component.html',
  styleUrls:   [ './customer-analysis.component.scss' ]
})
export class CustomerAnalysisComponent implements OnInit {
  analysis: any;
  caseListObj: any;
  commonInsurance: ICommonInsurance;
  selectedChart: string = '그래프';
  title: string;
  insuranceItem: any;
  isCustomerInsurance   = false;
  barPercent: number;
  categories: any;
  isShare: boolean = false;
  isCustomerAnalysis: boolean = false;
  isTotalAnalysis: boolean = false;
  pathName: string;

  constructor(
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastService: LayoutToastService,
    private _clipboard: Clipboard,
    private _changeDetectRef: ChangeDetectorRef,
    private _commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.isCustomerAnalysis = window.location.href.indexOf('template') === -1;
    this.isTotalAnalysis = window.location.href.indexOf('customer') !== -1;
    console.log('');
    this.isShare = !!this._route.snapshot.params?.share;
    if (!this.isShare) {
      this._headerService.show();
    }
    this._footerService.show();

    this.analysis   = this._route.snapshot.data?.analysis;
    this.pathName = this._getPathName();
    this.barPercent = this.analysis.total_prepaid_insurance_premium / this.analysis.total_premiums * 100;
    if (this.barPercent > 100) {
      this.barPercent = 100;
    }


    this.caseListObj = this.analysis.case_list.reduce(((object, caseItem) => {
      object[caseItem.id] = caseItem;
      return object;
    }), {});

    this._commonService.rxInsurance().subscribe(common => {
      this.commonInsurance = common;
      console.log('this.commonInsurance');
      console.log('this.analysis.insurance_list', this.analysis.insurance_list);
      this.categories = this.isTotalAnalysis ? this.commonInsurance.analysis_categories : this.commonInsurance.categories;
      console.log('this.categories', this.categories);
      this._initCaseList();
      console.log('this.insuranceCommon', this.commonInsurance);
    });

    // 종합 분석
    // 템플릿 분석
    // 개별 분석


    console.log('this.analysis?.customer', this.analysis?.customer);
    if (this.analysis.insurance_list.length > 1) {
      this.title = `${ this.analysis?.customer?.name }님 종합 분석 결과 (${ this.analysis?.insurance_list?.length }건)`;
    } else {
      this.insuranceItem       = this.analysis.insurance_list[0];
      this.isCustomerInsurance = !!this.insuranceItem?.insured_name;

      WaitHandler.wait(() => this.commonInsurance, () => {
        if (this.insuranceItem.insured_name) {
          this.title = `[${ this.commonInsurance?.insuranceListObj[this.insuranceItem.insurance] }] ${ this.insuranceItem.name }_${ this.insuranceItem.insured_name }님`;
        } else if (this.insuranceItem?.customer_name) {
          this.title = `[${ this.commonInsurance?.insuranceListObj[this.insuranceItem.insurance] }] ${ this.insuranceItem.name }_${ this.insuranceItem.customer_name }님`;
        } else {
          this.title = this.analysis.insurance_list[0].name;
        }
      });
    }

  }

  onEditInsurance() {
    if (this.analysis.customer) {
      this._router.navigateByUrl('insurance/' + this.insuranceItem.id);
    } else {
      this._router.navigateByUrl('template/edit/' + this.insuranceItem.id);
    }
  }

  onBack() {
    window.history.back();
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

  onCopyUrl() {
    GlobalBlurHandler.blur();
    let url = location.href;
    if (url.indexOf('share') === -1) {
      url = url.replace('analysis', 'analysis/share');
    }
    this._clipboard.copy(url);
    this._toastService.alert('링크가 복사 되었습니다.');
  }

  /******************************     etc functions     ****************************/


  private _initCaseList(): void {
    const detailIdList = Object.keys(this.caseListObj);
    this.categories.forEach(category => {
      category.sub_category_list.forEach(subCategory => {
        subCategory.detail_list.forEach(detail => {
          if (detailIdList.indexOf(detail.id.toString()) !== -1) {
            Object.keys(this.caseListObj[detail.id]).forEach(key => {
              detail[key] = this.caseListObj[detail.id][key];
            });
          }
        });
      });
    });

    this._changeDetectRef.detectChanges();

  }

  private _getPathName() {
    const result = '기존 포트폴리오';
    if (this.analysis.insurance_list.length === 1) {
      if (this.analysis.insurance_list[0].portfolio_type === 0) {
        return '자주 쓰는 설계'
      }
      if (this.analysis.insurance_list[0].portfolio_type === 2) {
        return '제안 포트폴리오'
      }
    }
    // {{analysis?.insurance_list?.length > 1 ? '기존 포트폴리오' : analysis?.insurance_list[0].portfolio_type === 0 }}
    return result;
  }
}
