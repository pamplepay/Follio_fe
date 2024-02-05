import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutToastService } from '../../../layout/toast/layout-toast.service';
import { ApiUrl } from '../../../core/constant/api.contant';
import { ApiService } from '../../../core/service/api/api.service';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-upload-image-modal',
  templateUrl: './upload-image-modal.component.html',
  styleUrls: ['./upload-image-modal.component.scss']
})
export class UploadImageModalComponent implements OnInit {
  @Input() customer: any;
  @Output() confirm = new EventEmitter();
  @Output() dismiss             = new EventEmitter();
  
  form: FormGroup;
  file: File | null = null;
  UploadImageRequest: Subscription | null = null;
  isUnsubscribe: boolean = false;

  constructor(
    private _toastService: LayoutToastService,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    
   }

  ngOnInit(): void {
    console.log('customer', this.customer);
    this.form = this.formBuilder.group({
      image_file: [null, Validators.required] // 필요한 유효성 검사를 추가하세요
    });
  }

  ngOnDestroy(): void {
    this.isUnsubscribe = true;
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.file = fileList[0];
      // 선택된 파일을 file 변수에 저장
    }
  }

  onClose() {
    this.dismiss.emit();
  }
  
  onSubmit() {
    if (!this.file) {
      this._toastService.alert('파일을 입력해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file, this.file.name); // 'file'은 서버에서 기대하는 필드 이름입니다.
    formData.append('id', this.customer.id);
  
    /******************************     request functions     ****************************/

    const url                            = ApiUrl.uploadImageFile;
    // const body                           = {
    //   datas: formData // FormData 객체를 body로 전달
    // };
    this.UploadImageRequest = this.apiService.post({
      url,
      body: formData
    })?.pipe(takeWhile(() => this.isUnsubscribe === false))
      .subscribe(res => {
        this.UploadImageRequest = null;
        console.log('UploadImageRequest res => ', res.detail);
        this.confirm.emit(res.detail);
      }, error => {
        this.UploadImageRequest = null;
        console.log('UploadImageRequest error =>', error);
      });

  
    //this.dismiss.emit();
  }

}
