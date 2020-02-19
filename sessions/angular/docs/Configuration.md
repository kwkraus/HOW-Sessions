# Configuration

## Angular features that support configuration for multiple environments

Discuss the settings that need to be configured for different environments

- URLs for APIs.
- Authentication keys.
- Logging level.

Explain the difference between:
```
ng build
ng build --prod
ng build --configuration=production
```

## Static (Simple Option)

[Angular Doc - Building](https://angular.io/guide/build)

------
### environment.ts files
[Angular Doc - Environments](https://angular.io/guide/build#configuring-application-environments)

Configuration settings can be listed here, but the values will be inside the TypeScript file, which is converted to JavaScript, uglified, minified, and bundled with with the rest of your JavaScript.

This is fine, if the developer is the one setting these values. However, if this is not the case, you cannot use the static/simple method.

------
### angular.json file

[Angular Doc - File replacements](https://angular.io/guide/build#configure-target-specific-file-replacements)

## Dynamic (Custom Code Option)

Demo app: [Angular Demo](https://github.com/laurieatkinson/ng-patterns-demo)

------
### config files

```
└──assets/config/
                └──config.dev.json
                └──config.prod.json
                └──config.deploy.json
```

config.deploy.json contains variables that can be substituted as a task in Azure DevOps or Octopus Deploy.

------
### app.config.ts
```javascript
export class AppConfig {
    static settings: IAppConfig;

    constructor(private http: HttpClient) {
    }

    load() {
        // Add a name property to the environment file that matches the file name for that environment
        const jsonFile = `assets/config/config.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise()
                .then((response: IAppConfig) => {
                    AppConfig.settings = <IAppConfig>response;
                    resolve();
                }).catch((response: any) => {
                    reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
                });
        });
    }
}
```
------
### app.module.ts
```javascript
export function initializeApp(appConfig: AppConfig) {
    const promise = appConfig.load().then(() => {
        // any additional initialization code using the config settings goes here
    });
    return () => promise;
}

providers: [
    {
        provide: APP_INITIALIZER, 
        useFactory: initializeApp,
        deps: [AppConfig],
        multi: true
    },
```

## Using the configuration settings

Since the settings are downloaded before any other code in executed in the app, you can always access these values whenever you need them.

Example usage:
------
### data.service.ts
```javascript
export class DataService {
    protected apiServer = AppConfig.settings ? AppConfig.settings.apiServer : null;
```
------
### logging.service.ts
```javascript
export class LoggingService {
    logException(exception: Error, severityLevel?: SeverityLevel) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.console) {
            this.sendToConsole(exception, severityLevel);
        }
    }
}
```
    "apiServer": {
        "books": "https://bookservicelaurie.azurewebsites.net/api/"
    }

----
# Lab Steps

## Step 1 - Add config JSON file

Add file 
```
└──assets/config/config.dev.json
```
```json
{
    "logging": {
        "console": true
    },
    "apiServer": {
        "books": "https://bookservicelaurie.azurewebsites.net/api/"
    }
}
```
------
## Step 2 - Add config class and interface files

Add file
```
└──app/models/app-config.models.ts
```
```javascript
export interface IAppConfig {
    logging: {
        console: boolean;
    };
    apiServer: {
        books: string;
    };
}
```
Update file
```
└──app/environment.ts
└──app/environment.prod.ts
```
```javascript
export const environment = {
  name: 'dev',
  production: false
};

export const environment = {
  name: 'prod',
  production: true
};
```
Add file
```
└──app/app.config.ts
```
```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './models/app-config.models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root'})
export class AppConfig {

    static settings: IAppConfig;

    constructor(private http: HttpClient) {
    }

    load() {
        const cacheBusterParam = (new Date()).getTime();
        const jsonFile = `assets/config/config.${environment.name}.json?nocache=${cacheBusterParam}`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise()
                .then((response: IAppConfig) => {
                    AppConfig.settings = <IAppConfig>response;
                    resolve();
                }).catch((response: any) => {
                    reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
                });
        });
    }
}
```
------
## Step 3 - Update App Module
Add above the @NgModule

```javascript
export function initializeApp(appConfig: AppConfig) {
    const promise = appConfig.load().then(() => {
        // any additional initialization code using the config settings goes here
    });
    return () => promise;
}

providers: [
    {
        provide: APP_INITIALIZER, 
        useFactory: initializeApp,
        deps: [AppConfig],
        multi: true
    }
]
```

## Step 4 - Use the configuration settings for the API URL

Modify file
```
└──app/services/data.service.ts
```
```javascript
export class DataService {
    // _booksUrl = 'https://bookservicelaurie.azurewebsites.net/api/books';
    _booksUrl = AppConfig.settings ? `${AppConfig.settings.apiServer.books}books` : null;
```
## Step 5 - Run the app
```
npm start
```
