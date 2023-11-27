import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { IUser } from '../../model/auth.model';
import { SessionStorageService } from '../../module/storage/session-storage.service';

const MINUTES_UNITL_AUTO_LOGOUT = 60; // in mins
const CHECK_INTERVAL            = 15000; // in ms
// const CHECK_INTERVAL            = 1000; // in ms
const STORE_KEY                 = 'lastAction';

/*
* 1시간 로그아웃 기능
* */
@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  intervalId: any | null= null;

  loginUser: IUser | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sessionStorage: SessionStorageService
  ) {}

  initAutoLogout(): void {
    this.check();
    this.initListener();
    this.initInterval();
    this.sessionStorage.set(STORE_KEY, Date.now().toString());
    this.authService.rxLoginUser().subscribe(loginUser => this.loginUser = loginUser)
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    if (this.loginUser) {
      return;
    }

    this.setLastAction(Date.now());
  }

  initInterval() {
    this.intervalId = setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  check() {
    if (!this.loginUser) {
      this.stopInterval();
      return;
    }

    const now       = Date.now();
    const timeleft  = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff      = timeleft - now;
    const isTimeout = diff < 0;
    if (isTimeout) {
      alert('미사용 시간 1시간이 지나 자동으로 로그아웃 됩니다.');
      this.authService.logout();
    }
  }

  private getLastAction() {
    return parseInt(this.sessionStorage.get(STORE_KEY), 10);
  }

  private setLastAction(lastAction: number) {
    this.sessionStorage.set(STORE_KEY, lastAction.toString());
  }
}
