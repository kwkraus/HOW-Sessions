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
### Step 2 - Add config class and interface files

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
### Step 3 - Update App Module

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
    _booksUrl = AppConfig.settings ? `${AppConfig.settings.apiServer}books` : null;
```
## Step 5 - Run the app
```
npm start
```
