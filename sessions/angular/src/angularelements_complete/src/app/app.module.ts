import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ImageSearchComponent } from './image-search/image-search.component';

@NgModule({
  declarations: [
    ImageSearchComponent // to register as an Angular component
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AppModule {
  constructor(private injector: Injector) {
  }
  ngDoBootstrap() {
    const imageSearchElement = createCustomElement(
      ImageSearchComponent, { injector: this.injector });
    customElements.define('image-search', imageSearchElement);
  }
}
