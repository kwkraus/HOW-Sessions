# Authorization
We'll reference another API to get a list of permissions that the currect user has.
With those permissions, we'll add the following features:
1. block navigation if the user does not have the required permission.
2. hide/remove visual elements from the page based on permission
3. customize the menu options based on permission

## Step 1 - Add values to the config file in Angular app

### Modify IAppConfig
Modify file
```
└──app/models/app-config.models.ts
```
```javascript
export interface IAppConfig {
    apiServer: {
        books: string;
        metadata: string;
    };
}
```

### config.dev.json files

```json
    "apiServer": {
        "metadata": "https://ng-demo-metadata.azurewebsites.net/api/"
    },
```

## Step 2 - Add a type to hold the valid permissions

### Create ActionCode type
Create file
```
└──app/models/authorization.types.ts
```
```javascript
export type ActionCode =
    'VIEW' |
    'UPDATE';
```
## Step 2 - Add the data service to call the authorization API

### services\authorization-data.service
```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import { ActionCode } from '../models/authorization.types';

@Injectable({ providedIn: 'root' })
export class AuthorizationDataService {

    private metadataUrl = AppConfig.settings ? AppConfig.settings.apiServer.metadata : null;

    constructor(private http: HttpClient) { }

    private handleError(error: any) {
      const errMsg = (error.message) ? error.message : error.status ?
        `${error.status} - ${error.statusText}` : 'Server error';
      return throwError(errMsg);
    }

    getPermissions() {
        return this.http.get<Array<ActionCode>>(`${this.metadataUrl}authorizations`)
        .pipe(
          catchError(this.handleError)
        );
    }
}
```

## Step 3 - Add an Angular service to cache the result of the authorization API call.

### services\authorization.service.ts
The hasPermission() method will return immediately true or false. So, the initializePermissions() method must be called prior to make sure the permissions have been retrieved from the server.

```javascript
import { Injectable } from '@angular/core';
import { ActionCode } from '../models/authorization.types';
import { AuthorizationDataService } from './authorization-data.service';
import { AppConfig } from '../app.config';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

    permissions: Array<ActionCode>; // The actions for which this user has permissions

    constructor(private authorizationDataService: AuthorizationDataService) {
    }

    hasPermission(action: ActionCode) {
        if (!AppConfig.settings.aad.requireAuth || !action) {
            return true;
        }
        if (this.permissions && this.permissions.find(permission => {
                return permission === action;
            })) {
            return true;
        }
        return false;
    }

    initializePermissions() {
        this.authorizationDataService.getPermissions()
        .subscribe(
            permissions => this.permissions = permissions
        );
    }
}
```

## Step 4 - Modify the auth-guard service to use the authorization service

In order to check a certain permission, we need to find a way to pass in that permission name. However, the way that a route guard is invoked does not allow for parameters. The solution is to use the ActivatedRoute data property, which is accessible when invoking the route guard.

### app-routing.module.ts
```javascript
        canActivate: [AuthGuardService],
        data: { actionCode: 'VIEW' },
```

### service\auth-guard.service.ts
```javascript
    constructor(private authService: AuthService, private authorizationService: AuthorizationService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return this.hasRequiredPermission(route.data['actionCode']);
    }

    private hasRequiredPermission(actionCode: ActionCode) {
        if (!AppConfig.settings.aad.requireAuth || this.authService.isUserAuthenticated) {
            if (this.authorizationService.permissions) {
                if (actionCode) {
                    return this.authorizationService.hasPermission(actionCode);
                } else {
                    return this.authorizationService.hasPermission(null);
                }
            } else {
                return this.authorizationService.initializePermissions()
                    .pipe(map((actionCodes) => {
                        if (actionCodes) {
                            return this.authorizationService.hasPermission(actionCode);
                        } else {
                            return this.authorizationService.hasPermission(null);
                        }
                    }),
                    catchError(() => {
                        return of(false);
                    }));
            }
        } else {
            this.authService.login();
            return false;
        }
    }
```

Run the application and attempt to navigate to the collection component. Watch the network traffic to see the request to the authorizations API.

## Step 5 - Require a missing permission in a route

Verify that the route guard works by adding an ADMIN permission that the user does not have.

### authorization.types.ts
```javascript
export type ActionCode =
    'VIEW' |
    'UPDATE' |
    'ADMIN';
```

### app-routing.module.ts
```javascript
  {
    canActivate: [AuthGuardService],
    data: { actionCode: 'ADMIN' },
    path: 'newsletter',
    component: NewsLetterComponent
  },
```

Run the application and attempt to navigate to the newsletter component, which is the SURPRISE ME link. You should be blocked and unable to navigate.

## Step 6 - Add directive to hide any HTML element if user does not have permission

### directives/hide-if-unauthorized.directive.ts
Add directives folder under the collection folder and create file for directive to hide any HTML element.

If this seems like the wrong place to add this, you are correct. However, if you place it in the AppModule, it will not be usable inside the CollectionModule unless it is imported. But, we can't import from the AppModule to the CollectionModule since that would create a circular reference. We will fix all of this in the next lesson on Module Organization.
```
└──app/collection/directives/hide-if-unauthorized.directive.ts
```
```javascript
import { OnInit } from '@angular/core';
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appHideIfUnauthorized]'
})
export class HideIfUnauthorizedDirective implements OnInit {
    @Input('appHideIfUnauthorized') permission: ActionCode;

    constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
    }

    ngOnInit() {
        if (!this.authorizationService.hasPermission(this.permission)) {
            this.el.nativeElement.style.display = 'none';
        }
    }
}
```

### collection.module.ts ###
Add the directive to the declarations section of the CollectionModule.

```javascript
@NgModule({
  declarations: [
    HideIfUnauthorizedDirective
  ],
})
```

## Step 7 - Use the directive to hide the Add Book button

### collection.component.html ###
Require that the user has ADMIN permision.

```html
  <div class="text-right add-btn" [appHideIfUnauthorized]="'ADMIN'">
    <button mat-raised-button color="primary" (click)="addBook()">
      <i class="material-icons">add_box</i> ADD BOOK</button>
  </div>
```
Navigate to the collections page and make sure that the Add Book button is hidden.

Try changing the permission to [appHideIfUnauthorized]="'UPDATE'" and then the Add Book button should be visible.

## Step 8 - Disable menu item if user does not have permission
The implementation of this feature would depend on the menu component used in your particular application. The demo app uses a Material Design menu which has a disabled property for each menu item. So, we'll set that based on the user's permission.

### tabs/inavlink.ts ###
This interface is used by the tabs component to pass in the data needed to build the menu bar. Add another property so that the interface looks like this:
```javascript
export interface INavlink {
    path: string;
    label: string;
    disabled?: boolean;
}
```

### tabs/tabs.component.ts ###
Require that the user has ADMIN permision to be able to click the "Surprise Me" menu item.

```javascript
export class TabsComponent {
    // Add a constructor since we'll need the AuthorizationService
    constructor(private authorizationService: AuthorizationService) {
    }
    . . .
    {
      path: 'newsletter',
      label: 'SURPRISE ME',
      disabled: !this.authorizationService.hasPermission('ADMIN')
    }
```

### tabs/tabs.component.html ###
```html
  <a mat-tab-link *ngFor="let link of navLinks"
    [routerLink]="link.path"
    routerLinkActive #rla="routerLinkActive"
    [active]="rla.isActive"
    [disabled]="link.disabled">
    {{link.label}}
  </a>
```

Run the app and verify that the menu item is disabled.
