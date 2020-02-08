import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { ErrorHandlerService } from './services/error-handler.service';
import { ErrorNotificationInterceptor } from './services/error-notification-interceptor.service';

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
    },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorNotificationInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
