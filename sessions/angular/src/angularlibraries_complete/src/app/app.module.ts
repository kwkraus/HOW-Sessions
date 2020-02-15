import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  MatListModule, MatCardModule, MatSlideToggleModule, MatDialogModule,
  MatIconModule, MatInputModule, MatSnackBarModule, MatTabsModule,
  MatButtonModule, MatLineModule, MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';

import { TabsComponent } from './tabs/tabs.component';
import { environment } from '../environments/environment';
import { NewsLetterComponent } from './newsletter/newsletter.component';
import { AppConfig } from './app.config';
import { CoreModule } from './core/core.module';
import { MyAboutComponentModule } from 'my-about-component';

export function initializeApp(appConfig: AppConfig) {
  const promise = appConfig.load().then(() => {
      if (AppConfig.settings && AppConfig.settings.logging &&
          AppConfig.settings.logging.appInsights) {
          const appInsights = new ApplicationInsights({
              config: {
                  instrumentationKey: AppConfig.settings.appInsights.instrumentationKey,
                  enableAutoRouteTracking: true // option to log all route changes
              }
          });
          appInsights.loadAppInsights();
          appInsights.trackPageView();
          AppConfig.appMonitor = appInsights;
      }
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
    CoreModule,
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
    MyAboutComponentModule,
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
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
