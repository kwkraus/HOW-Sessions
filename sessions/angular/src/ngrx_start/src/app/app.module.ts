import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';

import { TabsComponent } from './tabs/tabs.component';
import { environment } from '../environments/environment';
import { AppConfig } from './app.config';
import { CoreModule } from './core/core.module';

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
    HttpClientModule
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
