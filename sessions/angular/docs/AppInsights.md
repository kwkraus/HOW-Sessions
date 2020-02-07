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
        "appInsights": false
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

### app.module APP_INITIALIZER
```javascript
export function initializeApp(appConfig: AppConfig) {
    const promise = appConfig.load().then(() => {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            const config: Microsoft.ApplicationInsights.IConfig = {
                instrumentationKey: AppConfig.settings.appInsights.instrumentationKey
            };
            AppInsights.downloadAndSetup(config);
        }
    });
    return () => promise;
}
```

## Step 3 - Add App Insights JS library provided by Microsoft
You could merely place this JavaScript library on the index.html page and logging would be done.

Any exceptions inside the browser would be send to App Insights as well as page views.

However, if you want to catch exceptions, you will need to manually log those exceptions. And, the notion of page view is not so useful in the context of a SPA. So, again you would need to log these manually as the user navigates to a different clientside route.

### package.json file
```json
"dependencies": {
    "applicationinsights-js": "~1.0.20"
},
"devDependencies": {
    "@types/applicationinsights-js": "~1.0.9"
}
```

### applicationinsights-js documentation
https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md

## Step 4 - Consume the Application Insights SDK in custom logging class
Create a TypeScript class as a wrapper around the Application Insights JavaScript API and import the AppInsights class using the module loading system. Include methods for each method in the SDK that you want to support.

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
### logging.service.ts
```javascript
import { Injectable } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';
import { AppConfig } from '../app.config';
import { SeverityLevel } from '../models/logging.models';

@Injectable({ providedIn: 'root'})
export class LoggingService {

    logPageView(name?: string, url?: string, properties?: any, measurements?: any, duration?: number) {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackPageView(name, url, properties, measurements, duration);
        }
    }

    // Log non-exception type errors, e.g. invalid API request
    logError(error: any, severityLevel?: SeverityLevel) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.console) {
            this.sendToConsole(error, severityLevel);
        }
    }

    logEvent(name: string, properties?: any, measurements?: any) {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackEvent(name, properties, measurements);
        }
    }

    logMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number,
            properties?: any) {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackMetric(name, average, sampleCount, min, max, properties);
        }
    }

    logException(exception: Error, severityLevel?: SeverityLevel, handledAt?: string,
        properties?:any, measurements?: any) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.console) {
            this.sendToConsole(exception, severityLevel);
        }
        if (AppConfig.settings && AppConfig.settings.logging && 
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackException(exception, handledAt, properties, measurements, <AI.SeverityLevel>severityLevel);
        }
    }

    logTrace(message: string, properties?: any) {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            AppInsights.trackTrace(message, properties);
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