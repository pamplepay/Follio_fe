import { NgModule, ModuleWithProviders } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import { SessionStorageService } from './session-storage.service';
import { StorageService } from './storage.service';

@NgModule({
  providers: [
    StorageService,
    LocalStorageService,
    SessionStorageService
  ]
})
export class StorageModule {
}
