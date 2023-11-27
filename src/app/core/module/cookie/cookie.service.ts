import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  setCookie(cookieName: string, value: any, domain?: string, expires?: string) { // 로그인
    if (typeof value === 'undefined') {
      return;
    }

    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    document.cookie = cookieName + '=' + encodeURI(value) +
      ((domain) ? '; domain=' + domain : '') + ((expires) ? '; expires=' + expires : '');
  }

  getCookieToString(cookieName: string) { // 처음 init
    let result = null;

    const cookies        = document.cookie.split(';');
    const findCookieList = cookies.filter(a => a.indexOf(cookieName) !== -1);

    if (findCookieList.length !== 0) {
      const cookie = findCookieList[0].split('=').pop();
      result     = decodeURI(cookie);
    }

    return result;
  }

  getCookieToObject(cookieName: string) { // 처음 init
    let result = null;

    const cookies        = document.cookie.split(';');
    const findCookieList = cookies.filter(a => a.indexOf(cookieName) !== -1);

    if (findCookieList.length !== 0) {
      const cookie = findCookieList[0].split('=').pop();

      try {
        result = JSON.parse(decodeURI(cookie));
      } catch (e) {
        console.error('CookieService: cookie parse error');
        result = null;
      }
    }

    return result;
  }

  deleteCookie(cookieName: string, domain?: string) { // 로그아웃하는
    document.cookie = cookieName + '=;' + 'expires=Thu, 01 Jan 1970 00:00:01 GMT;' + ((domain) ? 'domain=' + domain : '');
  }
}

// 로그인 할때 쿠키에다가도 저장
// 로그아웃 할때 쿠키에 있는 데이터를 지워야함.
// 처음 init할때 쿠키를 확인해서 loginUser 가 있으면 로그인을 시켜야해.
