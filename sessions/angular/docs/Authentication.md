# Authentication with Azure AD

## Step 1 - Add App registration using the Azure portal
https://portal.azure.com

Azure Active Directory --> App registrations --> New registration
Redirect URI = http://localhost:4200
Authentication --> Implicit Grant --> ID tokens
Make note of the tenant id and the client id

## Step 2 - Add values to the config file in Angular app

### Modify IAppConfig
Modify file
```
└──app/models/app-config.models.ts
```
```javascript
export interface IAppConfig {
    aad: {
        requireAuth: boolean;
        tenant: string;
        resource: string;
        clientId: string;
        endpoints: { [key: string]: string };
    };
}
```

### config.dev.json files

```json
    "aad": {
        "requireAuth": true,
        "tenant": "7534f15c-6ed2-4469-bbb2-1d432dec01a6",
        "clientId": "5fb2a243-96aa-4583-abb7-a8a7e252cd1a",
        "endpoints": {
            "api": "5fb2a243-96aa-4583-abb7-a8a7e252cd1a"
        }
    }
```

The endpoints node allows you to specify a url (or part of a url) and the http interceptor will automatically insert the token in any request that includes that url.

In this example, any url that includes the string "api" will match and the token will be inserted into the header.

## Step 3 - Add ADAL package
```json
"dependencies": {
    . . .,
    "adal-angular4": "~4.0.12"
},
"devDependencies": {
    . . .,
    "@types/adal-angular": "~1.0.1",
```
```
npm install
```

## Step 4 - Initialize the ADAL service

### app.component.ts
```javascript
import { AdalService } from 'adal-angular4';

    constructor(private adalService: AdalService) {
        const adalConfig: adal.Config = {
            tenant: AppConfig.settings.aad.tenant,
            clientId: AppConfig.settings.aad.clientId,
            redirectUri: window.location.origin,
            navigateToLoginRequestUrl: true,
            endpoints: AppConfig.settings.aad.endpoints
        };
        adalService.init(adalConfig);
        this.adalService.handleWindowCallback();
    }
```

## Step 5 - Create an Auth Service wrapper for the Adal Service
The class will be used by the application to perform common authentication methods.

### services\auth.service.ts
```javascript
import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular4';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private adalService: AdalService) {
    }

    get isUserAuthenticated() {
        return this.adalService.userInfo ? this.adalService.userInfo.authenticated : false;
    }

    get userName() {
        return this.adalService.userInfo ? this.adalService.userInfo.userName : '';
    }

    login() {
        this.adalService.login();
    }

    logout(): void {
        this.adalService.logOut();
    }
}
```

## Step 7 - Create a guard service
The adal-angular4 library includes an authentication guard service, which could be used. However, there are a couple reasons to create our own.
1) If we upgrade to another library, there will only be one place that needs to be modified.
2) If we want to customize the logic. For instance, we have a config flag that allows the for authentication to be turned off.

### services\auth-guard.service.ts
```javascript
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { AppConfig } from '../app.config';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService) {
    }

    canActivate(): Promise<boolean> | boolean {
        if (!AppConfig.settings.aad.requireAuth || this.authService.isUserAuthenticated) {
            return true;
        }
        this.authService.login();
        return false;
    }
}
```
### app-routing.module.ts
To require the user to authenticate for all collection components, add the CanActivate guard to the route.

```javascript
    path: 'collection',
    canActivate: [AuthGuardService],
```

## Step 5 - Register the ADAL services in the module

### app.module.ts
```javascript
  providers: [
    AdalService, AdalGuard,
```

Run the application and it should redirect to login when the user navigates to the collection route.

## Step 6 - Add a login/logout button

### app.component.ts
```javascript
  isLoggedIn() {
    return this.authService.isUserAuthenticated;
  }

  userName() {
    return this.authService.userName;
  }

  signIn() {
    this.authService.login();
  }

  signOut() {
    this.authService.logout();
  }
```
### app.component.html
```html
  <mat-toolbar color="warn">
    <span>{{title}}</span>
    <span class="fill-remaining-space"></span>
    <!-- add the following -->
    <button mat-button *ngIf="!isLoggedIn()" (click)="signIn()">Sign in</button>
    <i *ngIf="isLoggedIn()" class="fa fa-user"></i>{{userName()}}
    <button mat-button *ngIf="isLoggedIn()" (click)="signOut()">Logout</button>
    <!-- to here -->
    <img src="assets/img/books-icon.png" class="center-block" style="max-height:100px" />
  </mat-toolbar>
```
## Step 7 - Add Http Interceptor
In order to send the token to the API for authentication on the backend, we should use an http interceptor.

Normally, we could use the AdalInterceptor provided in the adal-angular4 library, but this fails when the request is made to download our config JSON file. To solve this, create a child class that inherits from AdalInterceptor.

### auth-interceptor.service.ts
```javascript
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { AdalService, AdalInterceptor } from 'adal-angular4';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService extends AdalInterceptor {

    constructor(adalService: AdalService) {
        super(adalService);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (request.url.startsWith('assets/config') || !AppConfig.settings.aad.requireAuth) {
            return next.handle(request);
        }
        return super.intercept(request, next);
    }
}
```

### app.module.ts
```javascript
providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
```

When a request is made to the book service, you can look at the Network tab in the dev tools in the browser and see that the request header includes the Bearer token.

## Step 8 - ASP.NET API
Instead of calling https://bookservicelaurie.azurewebsites.net, download the ASP.NET solution in bookservice_api folder and run locally. The [Authorize] attribute on the controller forces the user to be logged in to have access to the actions.

Set a breakpoint inside one of the GET methods and look at the debugger to see this.User.