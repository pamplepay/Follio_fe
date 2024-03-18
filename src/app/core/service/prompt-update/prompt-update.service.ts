// import { Injectable } from '@angular/core';
// import { SwUpdate } from '@angular/service-worker';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class PromptUpdateService {
//
//   constructor(private _updates: SwUpdate) {
//
//   }
//
//   initAutoUpdate(): void {
//     this._updates.available.subscribe(event => {
//       this._updates.activateUpdate().then(() => {
//         alert('새로운 버전이 업데이트 되어 새고로침 합니다.');
//         document.location.reload();
//       });
//     });
//   }
// }
