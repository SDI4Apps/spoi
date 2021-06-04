import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HslayersModule} from 'hslayers-ng';

import {AppComponent} from './app.component';
import {SpoiPrettyInfopanelModule} from './pretty-info-panel/pretty-infopanel.module';

@NgModule({
  imports: [BrowserModule, HslayersModule, SpoiPrettyInfopanelModule],
  declarations: [AppComponent],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
