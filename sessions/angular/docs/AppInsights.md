# Application Insights
Show existing App Insights in the portal and discuss the information available for an application

## Step 1 - Add Application Insights service in Azure portal
https://portal.azure.com

Add Application Insights and note the instrumentation key

## Step 2(a) - Static (Simple Option)
Use this option if the App Insights key for each environment can be specified by the developer
### environment.ts files

```javascript
export const environment = {
    name: 'dev',
    appInsights: {
        instrumentationKey: '<your-key-here>'
    }
};
```

## Step 2(b) - Dynamic (Custom code Option)
Use this option if the App Insights key for each environment can be updated after buildtime by non-developer

### config.dev.json files
See Configuration module for more details on this option.

```json
    "logging": {
        "appInsights": true
    },
    "appInsights": {
        "instrumentationKey": "<your-key-here>"
    },
```

### Modify IAppConfig
Modify file
```
└──app/models/app-config.models.ts
```
```javascript
export interface IAppConfig {
    logging: {
        appInsights: boolean;
    };
    appInsights: {
        instrumentationKey: string;
    };
}
```

## Step 3 - Add App Insights JS library provided by Microsoft
You could merely place this JavaScript library on the index.html page and logging would be done.

Any exceptions inside the browser would be send to App Insights as well as page views.

However, if you want to catch exceptions, you will need to manually log those exceptions. And, the notion of page view is not so useful in the context of a SPA. So, again you would need to log these manually as the user navigates to a different clientside route.

### package.json file
```json
"dependencies": {
    "@microsoft/applicationinsights-web": "~2.4.4"
},
```
```
npm install
```

### applicationinsights-js documentation
https://github.com/microsoft/applicationinsights-js

### app.module APP_INITIALIZER
```javascript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

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
  }});
  return () => promise;
}
```

## Step 4 - Consume the Application Insights SDK in custom logging class
Create a TypeScript class as a wrapper around the Application Insights JavaScript API and import the AppInsights class using the module loading system. Include methods for each method in the SDK that you want to support.

### models/app-monitor.ts
Add interface for ApplicationInsights library to remove any dependency directly on App Insights in our custom logging service
```
export interface IAppMonitor {
    trackEvent(event: {name: string}, customProperties?: {
        [key: string]: any;
    }): void;
    trackPageView(pageView: {
        name?: string;
        uri?: string;
        refUri?: string;
        pageType?: string;
        isLoggedIn?: boolean;
        properties?: {
            duration?: number;
            [key: string]: any;
        }
    }): void;
    trackPageViewPerformance(pageViewPerformance: {
        name?: string;
        uri?: string;
        perfTotal?: string;
        duration?: string;
        networkConnect?: string;
        sentRequest?: string;
        receivedResponse?: string;
        domProcessing?: string;
    }): void;
    trackException(exception: { exception: Error, severityLevel?: number; }): void;
    trackTrace(trace: {message: string}, customProperties?: {
        [key: string]: any;
    }): void;
    trackMetric(metric: { name: string, average: number }, customProperties?: {
        [key: string]: any;
    }): void;
    startTrackPage(name?: string): void;
    stopTrackPage(name?: string, url?: string, customProperties?: {
        [key: string]: any;
    }, measurements?: {
        [key: string]: number;
    }): void;
    startTrackEvent(name?: string): void;
    stopTrackEvent(name: string, properties?: {
        [key: string]: string;
    }, measurements?: {
        [key: string]: number;
    }): void;
    flush(async?: boolean): void;
}
```
### logging.models.ts
```javascript
export enum SeverityLevel {
    Verbose = 0,
    Information = 1,
    Warning = 2,
    Error = 3,
    Critical = 4,
}
```

Add a property to the AppConfig class to store the one ApplicationInsights instance
### app.config.ts
```javascript
export class AppConfig {
  static appMonitor: IAppMonitor;
```
### services/logging.service.ts
```javascript
import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { SeverityLevel } from '../models/logging.models';

@Injectable({ providedIn: 'root'})
export class LoggingService {

    // Option if not using dynamic configuration file
    // appInsights: ApplicationInsights;
    // constructor() {
    //     this.appInsights = new ApplicationInsights({
    //         config: {
    //             instrumentationKey: environment.instrumentationKey,
    //             enableAutoRouteTracking: true // option to log all route changes
    //         }
    //     });
    //     this.appInsights.loadAppInsights();
    // }
    logPageView(name?: string, url?: string) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackPageView({
                name: name,
                uri: url
            });
        }
    }

    // Log non-exception type errors, e.g. invalid API request
    logError(error: any, severityLevel?: SeverityLevel) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.console) {
            this.sendToConsole(error, severityLevel);
        }
    }

    logEvent(name: string, properties?: { [key: string]: any }) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackEvent({ name: name}, properties);
        }
    }

    logMetric(name: string, average: number, properties?: { [key: string]: any }) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackMetric({ name: name, average: average }, properties);
        }
    }

    logException(exception: Error, severityLevel?: SeverityLevel) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.console) {
            this.sendToConsole(exception, severityLevel);
        }
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackException({ exception: exception, severityLevel: severityLevel });
        }
    }

    logTrace(message: string, properties?: { [key: string]: any }) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackTrace({ message: message}, properties);
        }
    }

    private sendToConsole(error: any, severityLevel: SeverityLevel = SeverityLevel.Error) {

        switch (severityLevel) {
            case SeverityLevel.Critical:
            case SeverityLevel.Error:
                (<any>console).group('Demo Error:');
                console.error(error);
                if (error.message) {
                    console.error(error.message);
                }
                if (error.stack) {
                    console.error(error.stack);
                }
                (<any>console).groupEnd();
                break;
            case SeverityLevel.Warning:
                (<any>console).group('Demo Error:');
                console.warn(error);
                (<any>console).groupEnd();
                break;
            case SeverityLevel.Information:
                (<any>console).group('Demo Error:');
                console.log(error);
                (<any>console).groupEnd();
                break;
        }
    }
}
```

## Step 5 - Provide Angular Error Handler that logs to App Insights

Create the custom error handler

### services/error-handler.service.ts
```javascript
import { ErrorHandler, Injectable } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root'})
export class ErrorHandlerService extends ErrorHandler {

    constructor(private loggingService: LoggingService) {
        super();
    }

    handleError(error: Error) {
        this.loggingService.logException(error); // Manually log exception
        const originalError = this.getOriginalError(error);
        if (originalError !== error) {
            this.loggingService.logException(originalError); // Manually log original exception
        }
    }

    private getOriginalError(error: any) {
        while (error && error.originalError) {
            error = error.originalError;
        }
        return (error);
    }
}
```
Supply custom error handler using the ErrorHandler provider

```javascript
@NgModule({
    providers: [
        { provide: ErrorHandler, useClass: ErrorHandlerService }
        . . .
    ]
})
export class AppModule {
}
```
## Step 6 - Run the app
```
npm start
```

View the browser network tab to see track requests and see how App Insights send data. Notice, they are POST requests and information is in the body of the request.

## Step 7 - introduce an exception and examine results in Azure portal

Add code to collection.component.ts ngOnInit() to cause an exception to occur

```javascript
    const testObject = {
      name: 'Fred'
    };
    const test = (<any>testObject).address.city;
```

Navigate to the Azure portal and the App Insights service - Failures.
Filter by Browser, Exceptions
Drill into Exceptions, click on one and "Show what happened before and after..."

Also view the Performance tab to see page views.