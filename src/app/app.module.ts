import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { ModalsModule } from './shared/modals/modals.module';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './core/strategy/custom-route-reuse-strategy';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports:      [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    LayoutModule,
    ModalsModule
  ],
  providers:    [
    {
      provide:  COMPOSITION_BUFFER_MODE,
      useValue: false
    }
    // {
    //   provide:  RouteReuseStrategy,
    //   useClass: CustomRouteReuseStrategy
    // }
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {
}
