import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  MatListModule, MatCardModule, MatSlideToggleModule, MatDialogModule,
  MatIconModule, MatInputModule, MatSnackBarModule, MatTabsModule,
  MatButtonModule, MatLineModule, MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';

import { TabsComponent } from './tabs/tabs.component';
import { environment } from '../environments/environment';
import { NewsLetterComponent } from './newsletter/newsletter.component';
import { AppConfig } from './app.config';

export function initializeApp(appConfig: AppConfig) {
  const promise = appConfig.load().then(() => {
      // any additional initialization code using the config settings goes here
  });
  return () => promise;
}

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    TabsComponent,
    NewsLetterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatListModule,
    MatTabsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatLineModule,
    MatInputModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {
        provide: APP_INITIALIZER, 
        useFactory: initializeApp,
        deps: [AppConfig],
        multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
