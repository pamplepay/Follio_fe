import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth/auth.service';
import { LayoutModalService } from '../../layout/modal/layout-modal.service';
import { EditUserModalComponent } from '../../shared/modals/edit-user/edit-user-modal.component';
import { ApiService } from '../../core/service/api/api.service';
import { Observable, Subscription } from 'rxjs';
import { ApiUrl } from '../../core/constant/api.contant';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { IUser } from '../../core/model/auth.model';
import { AlertModalComponent } from '../../shared/modals/alert/alert-modal.component';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { Router } from '@angular/router';
import { DateHandler } from '../../core/handler/date-handler/date-handler';
import { Clipboard } from '@angular/cdk/clipboard';
import { RecommendCodeModalComponent } from '../../shared/modals/recommend-code-modal/recommend-code-modal.component';

@Component({
  selector:    'app-user',
  templateUrl: './user.component.html',
  styleUrls:   [ './user.component.scss' ]
})
export class UserComponent implements OnInit {
  private SDeleteUserRequest: Subscription;
  loginUser: any;
  remainDays: number;

  constructor(
    private _authService: AuthService,
    private _apiService: ApiService,
    private _router: Router,
    private _modalService: LayoutModalService,
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService,
    private _toastService: LayoutToastService,
    private _clipboard: Clipboard
  ) {
  }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();
    this._authService.rxLoginUser().subscribe(loginUser => {
      this.loginUser = loginUser;
      if (this.loginUser?.user_membership) {
        const nowDate   = DateHandler.getNowDate();
        this.remainDays = DateHandler.getDaysBetweenTwoDate(nowDate, this.loginUser?.user_membership.expiry_at);
        if (this.remainDays <= 0) {
          this.remainDays = 0;
        }
      }
    });

    // this._modalService.create(EditUserModalComponent, {
    //   dismiss:  () => this._modalService.dismiss(),
    //   complete: () => this._modalService.dismiss()
    // });
  }

  onEditUser() {
    this._modalService.create(EditUserModalComponent, {
      dismiss:  () => this._modalService.dismiss(),
      complete: () => this._modalService.dismiss()
    });
  }

  onRequestDeleteUser(): void {
    this._modalService.create(EditUserModalComponent, {
      dismiss:  () => this._modalService.dismiss(),
      complete: () => {
        this._requestDeleteUser();
        this._modalService.dismiss();
      }
    });
  }

  private _requestDeleteUser() {
    if (this.SDeleteUserRequest) { // 연속 처리 방지
      this._toastService.alert('잠시만 기다려주세요.');
      return;
    }

    const url               = ApiUrl.requestDeleteUser;
    this.SDeleteUserRequest = this._apiService.get({
      url
    }).subscribe(res => {
      console.log('requestDeleteUser res => ', res);
      this.SDeleteUserRequest = null;
    }, error => {
      console.log('requestDeleteUser error =>', error);
      this.SDeleteUserRequest = null;
    });
  }

  onLogout() {
    this._modalService.create(AlertModalComponent, {
      title:     '로그아웃',
      body:      '정말 로그아웃 하시겠어요?',
      isConfirm: true,
      dismiss:   () => this._modalService.dismiss(),
      cancel:    () => {
        this._modalService.dismiss();
      },
      confirm:   () => {
        this._authService.logout();
        this._modalService.dismiss();
      }
    });
  }

  onDevelop() {
    this._toastService.alert('개발중 입니다.');
  }

  onOut() {
    window.open('https://forms.gle/h1HiYKx24cKgyETx8', '_blank');
  }

  onGotoPrice() {
    this._router.navigateByUrl('price');
  }

  onGotoPayment() {
    this._router.navigateByUrl('payment');
  }

  onAddRecommendUser() {
    this._modalService.create(RecommendCodeModalComponent, {
      complete: () => this._modalService.dismiss(),
      dismiss:  () => this._modalService.dismiss()
    });
  }

  onCopyRecommendCode(recommend_code: any) {
    this._clipboard.copy(recommend_code);

    this._toastService.alert('추천코드가 복사 되었습니다.');
  }
}
