import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ApiService } from '../api/api.service';
import { ApiUrl } from '../../constant/api.contant';
import { SessionStorageService } from '../../module/storage/session-storage.service';
import { LocalStorageService } from '../../module/storage/local-storage.service';
import { SortHandler } from '../../handler/sort-handler/sort-handler';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private insurance$ = new BehaviorSubject<any>(null);
  private SGetCommonInsuranceRequest: Subscription | undefined;

  constructor(
    private _apiService: ApiService,
    private _localStorageService: LocalStorageService
  ) {
    const insurance = this._localStorageService.get('common_insurance');
    if (insurance) {
      this.insurance$.next(insurance);
    }
  }

  rxInsurance(): Observable<any> {
    return this.insurance$;
  }

  getInsurance(): void {
    this._requestGetCommonInsurance();
  }

  private _requestGetCommonInsurance() {
    if (this.SGetCommonInsuranceRequest) { // 연속 처리 방지
      return;
    }

    const url                       = ApiUrl.getCommonInsurance;
    this.SGetCommonInsuranceRequest = this._apiService.get({
      url,
      isLoading: false
    }).subscribe(res => {
      console.log('requestGetCommonInsurance res => ', res);
      SortHandler.ascendingObjectWithKey(res.insurance_list, 'name');
      res.insurance_list = SortHandler.KOR_ENG_ETC(res.insurance_list, 'name');
      const insuranceListObj   = res.insurance_list.reduce((obj, item) => {
        obj[item.id] = item.name;
        return obj;
      }, {});
      res.life_insurance_list = res.insurance_list.filter(item => item.insurance_type === 1);
      res.loss_insurance_list = res.insurance_list.filter(item => item.insurance_type === 2);

      res['paymentPeriodType'] = {
        1: '년',
        2: '년 갱신'
      };
      res['paymentPeriodTypeList'] = [];
      Object.keys(res['paymentPeriodType']).forEach(key => {
        res['paymentPeriodTypeList'].push({
          value:  parseInt(key, 10),
          name: res['paymentPeriodType'][key],
        })
      });

      res['warrantyPeriodType'] = {
        1: '세 만기',
        2: '년 만기',
        3: '종신'
      };
      res['warrantyPeriodTypeList'] = [];
      Object.keys(res['warrantyPeriodType']).forEach(key => {
        res['warrantyPeriodTypeList'].push({
          value:  parseInt(key, 10),
          name: res['warrantyPeriodType'][key],
        })
      });

      res['caseWarrantyPeriodType'] = {
        1: '세',
        2: '년',
        3: '날짜',
        4: '종신'
      };
      res['caseWarrantyPeriodTypeList'] = [];
      Object.keys(res['caseWarrantyPeriodType']).forEach(key => {
        res['caseWarrantyPeriodTypeList'].push({
          value:  parseInt(key, 10),
          name: res['caseWarrantyPeriodType'][key],
        })
      });

      res['casePaymentPeriodType'] = {
        1: '년',
        2: '세',
        3: '년 갱신'
      };
      res['casePaymentPeriodTypeList'] = [];
      Object.keys(res['casePaymentPeriodType']).forEach(key => {
        res['casePaymentPeriodTypeList'].push({
          value:  parseInt(key, 10),
          name: res['casePaymentPeriodType'][key],
        })
      });

      res['refundType'] = {
        1: '종신보험',
        2: '만급환급',
        3: '50%환급',
        4: '순수보장형'
      };
      res['refundTypeList'] = [];
      Object.keys(res['refundType']).forEach(key => {
        console.log('value: key', key);
        res['refundTypeList'].push({
          value: parseInt(key, 10),
          name: res['refundType'][key],
        })

      });

      console.log('res[\'refundTypeList\']', res['refundTypeList']);

      res['insuranceListObj'] = insuranceListObj;
      this.insurance$.next(res);
      this._localStorageService.set('common_insurance', res);
      this.SGetCommonInsuranceRequest = null;
    }, error => {
      console.log('requestGetCommonInsurance error =>', error);
      this.SGetCommonInsuranceRequest = null;
    });
  }
}
