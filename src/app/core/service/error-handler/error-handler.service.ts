import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler {

  constructor(private injector: Injector) {
    super();
  }

  handleError(error: any): void {
    // 로컬인 경우에는 핸들러 작동하지 않음.
    const router = this.injector.get(Router);
    if (error.message.includes('Cannot match any routes') === true) {
      router.navigate([ '' ]);
    }

    if (window.location.hostname === 'localhost') {
      super.handleError(error);
      return;
    }

    let errorMessage = null;
    let errorStack   = null;
    let loginUserName = null;
    let loginUserNo   = null;
    const url           = window.location.href;
    const path          = window.location.pathname;
    const userAgent     = navigator.userAgent;

    if (typeof error === 'object') {
      errorMessage = error.message || null;
      errorStack   = error.stack || null;
    }
    if (typeof error === 'string') {
      errorMessage = error;
    }

    const authService = this.injector.get(AuthService);

    const loginUser = authService.getLoginUser();

    if (loginUser) {
      loginUserName = loginUser.name;
      loginUserNo   = loginUser.id;
    }

    const message = {
      url,
      path,
      userAgent,
      errorMessage,

      // null 허용
      errorStack,
      loginUserNo,
      loginUserName,
    };

    // const toolsApiService = this.injector.get(ToolsApiService);
    // const condition        = {
    //   transactor:  'webBiz',
    //   environment: ENV.NAME,
    //   message:     JSON.stringify(message)
    // };
    //
    // toolsApiService.createErrorLog(condition).subscribe((res) => {
    //   console.log('handleError', res);
    // });

    super.handleError(error);
  }
}
