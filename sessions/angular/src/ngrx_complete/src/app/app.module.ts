import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import {
  MatListModule, MatCardModule, MatSlideToggleModule, MatDialogModule,
  MatIconModule, MatInputModule, MatSnackBarModule, MatTabsModule,
  MatButtonModule, MatLineModule, MatToolbarModule
} from '@angular/material';
import { TabsComponent } from './tabs/tabs.component';
import { environment } from '../environments/environment';
import { AppConfig } from './app.config';
import { CoreModule } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './reducers';

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
    TabsComponent
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
    MatInputModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    })
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
