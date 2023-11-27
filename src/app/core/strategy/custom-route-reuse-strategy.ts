import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { LocationStrategy } from '@angular/common';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  private handlers: { [key: string]: DetachedRouteHandle } = {};
  private page;

  constructor() {
    window.onpopstate = (event) => {
      this.page = event?.state?.page;
    };
  }

  // Back-navigation monitoring

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig.path.includes('list');
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const page = history.length;
    const key = `${route.url.join('/') || route.parent.url.join('/')}_${page}`
    console.log('store key', key);
    this.handlers[key] = handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = `${route.url.join('/') || route.parent.url.join('/')}_${this.page}`
    console.log('shouldAttach key', key);
    return !!this.handlers[key];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const key = `${route.url.join('/') || route.parent.url.join('/')}_${this.page}`
    console.log('retrieve key', key);
    return this.handlers[key];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

}
