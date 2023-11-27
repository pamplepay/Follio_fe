import { NgModule, ModuleWithProviders } from '@angular/core';

import { HistoryService } from './history.service';

@NgModule({
  providers: [
    HistoryService
  ]
})
export class HistoryModule {
}
