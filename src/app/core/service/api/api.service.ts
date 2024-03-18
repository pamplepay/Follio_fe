import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LayoutLoadingService } from '../../../layout/loading/layout-loading.service';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  headers: HttpHeaders;
  requestList: symbol[]           = [];
  requestList$: Subject<symbol[]> = new Subject<symbol[]>();

  cacheTable: any = {};

  constructor(private httpClient: HttpClient,
              private layoutLoading: LayoutLoadingService) {
    // 공통 header 작성 부분
    // this.headers = new HttpHeaders({ AuthHeaderKey: `Token ${ key }` });
    this.requestList$.subscribe(list => {
      list?.length > 0 ? this.layoutLoading.show('over') : this.layoutLoading.hide();
    });
  }

  /*
  * 사용여부 파악중
  * */
  setToken(token: string): void {
    this.headers = token ? new HttpHeaders({ Authorization: `Token ${ token }` }) : new HttpHeaders();
  }

  getHeaders(): HttpHeaders {
    return this.headers;
  }

  get({ url, params, headers = this.headers, isLoading = true, isCaching = false }:
        { url: string, params?: any, headers?: HttpHeaders, isLoading?: boolean, isCaching?: boolean }): Observable<any> {
    if (environment.isTesting === true) {
      return null;
    }

    if (isCaching) {
      const key = this.getCachingKey(url, params);
      if (this.cacheTable[key]) {
        const result = new Subject();
        setTimeout(() => { result.next(this.cacheTable[key]); },10);
        return result;
      }
    }

    const apiId = Symbol('apiId');
    if (isLoading) {
      this.requestList.push(apiId);
      this.requestList$.next(this.requestList);
    }

    return this.httpClient.get(`${ environment.apiUrl }/${ url }`, {
      params,
      headers
    })?.pipe(
      tap(value => {
        if (isCaching) {
          const key = this.getCachingKey(url, params);
          this.caching(key, value);
        }
      }),
      this.hideLoading(isLoading, apiId),
      finalize(() => isLoading && this.removeApiId(apiId))
    );
  }

  post({ url, body, headers = this.headers, isLoading = true }:
         { url: string, body?: any, headers?: HttpHeaders, isLoading?: boolean }): Observable<any> {
    if (environment.isTesting === true) {
      return null;
    }
    const apiId = Symbol('apiId');
    if (isLoading) {
      this.requestList.push(apiId);
      this.requestList$.next(this.requestList);
    }
    return this.httpClient.post(`${ environment.apiUrl }/${ url }`, body, { headers }
    )?.pipe(
      this.hideLoading(isLoading, apiId),
      finalize(() => isLoading && this.removeApiId(apiId))
    );
  }

  put({ url, body, headers = this.headers, isLoading = true }:
        { url: string, body?: any, headers?: HttpHeaders, isLoading?: boolean }): Observable<any> {
    if (environment.isTesting === true) {
      return null;
    }
    const apiId = Symbol('apiId');
    if (isLoading) {
      this.requestList.push(apiId);
      this.requestList$.next(this.requestList);
    }
    return this.httpClient.put(`${ environment.apiUrl }/${ url }`, body, { headers }
    )?.pipe(
      this.hideLoading(isLoading, apiId),
      finalize(() => isLoading && this.removeApiId(apiId))
    );
  }

  patch({ url, body, headers = this.headers, isLoading = true }:
          { url: string, body?: any, headers?: HttpHeaders, isLoading?: boolean }): Observable<any> {
    if (environment.isTesting === true) {
      return null;
    }
    const apiId = Symbol('apiId');
    if (isLoading) {
      this.requestList.push(apiId);
      this.requestList$.next(this.requestList);
    }
    return this.httpClient.patch(`${ environment.apiUrl }/${ url }`, body, { headers }
    )?.pipe(
      this.hideLoading(isLoading, apiId),
      finalize(() => isLoading && this.removeApiId(apiId))
    );
  }

  delete({ url, headers = this.headers, isLoading = true }:
           { url: string, headers?: HttpHeaders, isLoading?: boolean }): Observable<any> {
    if (environment.isTesting === true) {
      return null;
    }
    const apiId = Symbol('apiId');
    if (isLoading) {
      this.requestList.push(apiId);
      this.requestList$.next(this.requestList);
    }
    return this.httpClient.delete(`${ environment.apiUrl }/${ url }`, { headers }
    )?.pipe(
      this.hideLoading(isLoading, apiId),
      finalize(() => isLoading && this.removeApiId(apiId))
    );
  }


  private hideLoading(isLoading, apiId) {
    return isLoading ? tap(() => {
      this.removeApiId(apiId);
    }, () => {
      this.removeApiId(apiId);
    }, () => {
      this.removeApiId(apiId);
    }) : tap();
  }

  private removeApiId(apiId): void {
    if (this.requestList.indexOf(apiId) !== -1) {
      this.requestList.splice(this.requestList.indexOf(apiId), 1);
      this.requestList$.next(this.requestList);
    }
  }

  private caching(key, value: any) {
    this.cacheTable[key] = value;
    console.log('caching', this.cacheTable[key]);
  }

  clearCaching() {
    this.cacheTable = {};
  }

  removeCaching(key) {
    this.cacheTable[key] = null;
  }

  getCachingKey(url, params) {
    let result = url;
    if (params) {
      Object.keys(params).forEach((key, index) => {
        result = result + (index === 0 ? '?' : '&') +  'key=' + params[key]
      })
    }
    return result;
  }
}
