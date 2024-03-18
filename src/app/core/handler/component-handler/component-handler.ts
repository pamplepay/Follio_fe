import { EventEmitter } from '@angular/core';

export class ComponentHandler {
  static createComponent(resolver: any, target: any, component: any, params: any) {
    const componentFactory   = resolver.resolveComponentFactory(component);
    const componentReference = target.createComponent(componentFactory);

    const keys          = Object.keys(params);
    const componentKeys = Object.keys(componentReference.instance);

    // EventEmitter 가 아닌 변수는 data 에서 가져온 값들로 대체
    for (const key of keys) {
      if (!(componentReference.instance[key] instanceof EventEmitter)) {
        componentReference.instance[key] = params[key];
      }
    }

    // EventEmitter 인 것들은 data 해당 값 존재시 emit 될때마다 data 펑션 실행
    for (const key of componentKeys) {
      if (componentReference.instance[key] instanceof EventEmitter && params[key]) {
        componentReference.instance[key].subscribe(
            (result: any) => {
              if (typeof params[key] === 'function') {
                params[key](result);
              }
            }
        );
      }
    }

    return componentReference;
  }
}
