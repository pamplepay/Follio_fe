import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../../core/service/api/api.service';
import { ApiUrl } from '../../../core/constant/api.contant';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Validator } from '../../../core/validator/validator';
import { LayoutModalService } from '../../../layout/modal/layout-modal.service';
import { AlertModalComponent } from '../alert/alert-modal.component';
import { GlobalBlurHandler } from '../../../core/handler/globar-blur-handler/globar-blur-handler';
import { LayoutToastService } from '../../../layout/toast/layout-toast.service';

@Component({
  selector:    'app-case-history-modal',
  templateUrl: './case-history-modal.component.html',
  styleUrls:   [ './case-history-modal.component.scss' ]
})
export class CaseHistoryModalComponent implements OnInit {
  @Input() customer: any;
  @Output() dismiss        = new EventEmitter();
  customerMedicalHistoryList: any[];
  selectedMedicalHistory: any;
  form: FormGroup;
  isShowValidLine: boolean = false;

  private SCustomerHistoryListRequest: Subscription | undefined;
  private SUpdateCustomerHistoryRequest: Subscription | undefined;
  private SCreateCustomerHistoryRequest: Subscription | undefined;
  private SDeleteCustomerMedicalHistoryRequest: Subscription | undefined;

  constructor(
    private _apiService: ApiService,
    private _formBuilder: FormBuilder,
    private _toastService: LayoutToastService,
    private _modalService: LayoutModalService
  ) {
  }

  ngOnInit(): void {
    this._requestCustomerHistoryList();
    this._initForm();
  }

  /******************************     event functions     ****************************/


  onClose() {
    this.dismiss.emit();
  }

  onDeleteMedicalHistory() {

    this._modalService.create(AlertModalComponent, {
      width:     '320px',
      title:     '병력 삭제',
      body:      '병력을 삭제하시겠습니까?',
      isConfirm: true,
      dismiss:   () => {
        this._modalService.dismiss();
      },
      cancel:    () => {
        this._modalService.dismiss();
      },
      confirm:   () => {
        if (!this.selectedMedicalHistory) {
          this._initForm();
        } else {
          this._requestDeleteCustomerMedicalHistory();
        }
        this._modalService.dismiss();
      }
    });
  }

  onSubmit() {
    this.isShowValidLine = true;
    console.log('this.form.valid', this.form.valid);
    if (!this.form.valid) {
      return;
    }


    const value = this.form.value;

    if (this.selectedMedicalHistory) {
      this._requestUpdateCustomerHistory(value);
    } else {
      this._requestCreateCustomerHistory(value);
    }
  }

  onAddCase() {
    this.isShowValidLine        = false;
    this.selectedMedicalHistory = null;
    this._initForm();
  }

  onClickMedicalHistory(customerMedicalHistoryItem) {
    this.selectedMedicalHistory = customerMedicalHistoryItem;
    this._initForm(customerMedicalHistoryItem);
  }

  /******************************     request functions     ****************************/

  private _requestCustomerHistoryList() {
    if (this.SCustomerHistoryListRequest) { // 연속 처리 방지
      return;
    }

    const url                        = ApiUrl.getMedicalHistoryListWithCustomer.replace(':id', this.customer.id.toString());
    this.SCustomerHistoryListRequest = this._apiService.get({
      url
    }).subscribe(res => {
      console.log('requestCustomerHistoryList res => ', res);
      this.customerMedicalHistoryList  = res;
      this.SCustomerHistoryListRequest = null;
    }, error => {
      console.log('requestCustomerHistoryList error =>', error);
      this.SCustomerHistoryListRequest = null;
    });
  }

  private _requestCreateCustomerHistory(value) {
    if (this.SCreateCustomerHistoryRequest) { // 연속 처리 방지
      return;
    }

    const url  = ApiUrl.createCustomerMedicalHistory;
    const body = value;

    this.SCreateCustomerHistoryRequest = this._apiService.post({
      url,
      body
    }).subscribe(res => {
      console.log('requestCreateCustomerHistory res => ', res);
      this.customerMedicalHistoryList.push(res);
      this.selectedMedicalHistory = res;
      this._toastService.alert('추가하였습니다');
      this.SCreateCustomerHistoryRequest = null;
    }, error => {
      console.log('requestCreateCustomerHistory error =>', error);
      this.SCreateCustomerHistoryRequest = null;
    });
  }

  private _requestUpdateCustomerHistory(value: any) {
    if (this.SUpdateCustomerHistoryRequest) { // 연속 처리 방지
      return;
    }

    const url = ApiUrl.updateCustomerMedicalHistory.replace(':id', this.selectedMedicalHistory.id.toString());

    const body = value;

    this.SUpdateCustomerHistoryRequest = this._apiService.patch({
      url,
      body
    }).subscribe(res => {
      console.log('requestUpdateCustomerHistory res => ', res);
      this._toastService.alert('수정하였습니다');
      Object.keys(res).forEach(key => {
        this.selectedMedicalHistory[key] = res[key];
      });
      this.SUpdateCustomerHistoryRequest = null;
    }, error => {
      console.log('requestUpdateCustomerHistory error =>', error);
      this.SUpdateCustomerHistoryRequest = null;
    });
  }

  private _requestDeleteCustomerMedicalHistory() {
    if (this.SDeleteCustomerMedicalHistoryRequest) { // 연속 처리 방지
      return;
    }

    const url                                 = ApiUrl.deleteCustomerMedicalHistory.replace(':id', this.selectedMedicalHistory.id.toString());
    this.SDeleteCustomerMedicalHistoryRequest = this._apiService.delete({
      url
    }).subscribe(res => {
      console.log('requestDeleteCustomerMedicalHistory res => ', res);
      const index = this.customerMedicalHistoryList.findIndex(item => item.id === this.selectedMedicalHistory.id);
      this.customerMedicalHistoryList.splice(index, 1);
      this._initForm();
      this._toastService.alert('삭제하였습니다');
      this.SDeleteCustomerMedicalHistoryRequest = null;
    }, error => {
      console.log('requestDeleteCustomerMedicalHistory error =>', error);
      this.SDeleteCustomerMedicalHistoryRequest = null;
    });
  }

  /******************************     etc functions     ****************************/

  private _initForm(medicalHistory?: any): void {
    this.isShowValidLine = false;
    const result         = this._formBuilder.group({
      customer:             this.customer.id,
      is_inpatient:         [
        medicalHistory?.is_inpatient || null,
        [ Validators.required ]
      ],
      diagnostic_name:      [
        medicalHistory?.diagnostic_name || '',
        [ Validators.required ]
      ],
      hospital_name:        medicalHistory?.hospital_name || '',
      treatment_content:    [
        medicalHistory?.treatment_content || '',
        [ Validators.required ]
      ],
      treatment_start_date: [
        medicalHistory?.treatment_start_date || '',
        [ Validator.date() ]
      ],
      treatment_end_date:   [
        medicalHistory?.treatment_end_date || '',
        [ Validator.date() ]
      ],
      is_recurrence:        medicalHistory?.is_recurrence || null,
      is_cure:              medicalHistory?.is_cure || null
    });

    this.form = result;
    console.log(this.form.get('is_inpatient').value);
  }

  onSelect(control: AbstractControl, value: any) {
    control.setValue(value);
    GlobalBlurHandler.blur();
  }

  onFocusBottom(formList: HTMLDivElement) {
    formList.scrollTo(0, 99999);
  }
}
