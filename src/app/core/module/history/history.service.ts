import { Injectable } from '@angular/core';
import { HistoryPushStateModel } from './history.model';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  /**
   * @type {HistoryPushStateModel[]}
   * @description 히스토리 pop할 때 확인할수 있는 정보를 담는 배열이다.
   * */
  stateArray: HistoryPushStateModel[] = [];

  /**
   * @type {Subject<any>}
   * @description history의 pop을 받는 Subject 변수이다.
   * */
  history$: Subject<any> = new Subject<any>();

  isInit: boolean = false;

  constructor() {
    // this._init();
  }

  /**
   * @method HistoryService.init()
   * @description window의 onpopstate의 이벤트를 받아 뒤로가거나 앞으로가는 경우에 구독하는 부분에 상태 값을 알린다.
   *
   * 1. 배열에 들어있는 최근값을 꺼내 현재 페이지 안에서 일어나는 일인지 확인한다.
   * 2. 맞으면 상태값을 발행한다.
   * 3. 틀리면 현재 배열을 초기화 시킨다. (다른 페이지로 이동하였다는 것으로 간주하고 초기화)
   * */
  private _init(): void {
    window.onpopstate = (event) => {
      if (this.stateArray.length) {
        const stateItem = this.stateArray.pop();
        // const nowUrl = window.location.href.substr(window.location.href.indexOf('/', 10));

        if (stateItem) {
          if (stateItem.callback) {
            stateItem.callback();
          }
        }

        // if (nowUrl === stateItem.url) {
        //   this.history$.next(stateItem.state);
        // } else {
        //   this.stateArray = [];
        // }
      }
    };

    this.isInit = true;
  }

  /**
   * @method HistoryService.push()
   * @param {string} - history를 구분할 수 있는 값을 받아온다. ex) id값, history 발생 시점의 이름 등등
   * @return {Observable<any>} - pop을 구독할 수 있는 history 옵저블을 return한다.
   * @description window.history.pushstate 이벤트를 이용해서 history를 집어 넣는 부분으로 stateArray에 상태값과 url을 저장한다.
   * */
  push(state: string): Observable<any> {
    const url = window.location.href.substr(window.location.href.indexOf('/', 10));

    this.stateArray.push({
      state,
      url
    });
    window.history.replaceState(state, null, url);
    // window.history.pushState(state, null, url);

    return this.history$;
  }

  pushWithCallback(callback: () => void) {
    if (!this.isInit) {
      this._init();
    }

    // const url = window.location.href.substr(window.location.href.indexOf('/', 10));
    const urlHash  = window.location.hash;
    const pathName = window.location.pathname;
    const state    = (Math.floor(Math.random() * 100000) + 1) + ''; // 1~ 100000

    this.stateArray.push({
      state,
      url: urlHash,
      callback
    });
    console.log('pushWithCallback, url', urlHash);
    // window.history.pushState(state, null, url);
    window.history.pushState(state, null, pathName + urlHash + '#modal');
  }

  addPushState() {
    const urlHash  = window.location.hash;
    const pathName = window.location.pathname;
    const state    = (Math.floor(Math.random() * 100000) + 1) + ''; // 1~ 100000

    window.history.pushState(state, null, pathName + urlHash + '#modal');
  }

  /**
   * @method HistoryService.clean()
   * @description stateArray를 초기화 시켜주는 함수이다.
   * */
  clean(): void {
    this.stateArray = [];
  }
}
