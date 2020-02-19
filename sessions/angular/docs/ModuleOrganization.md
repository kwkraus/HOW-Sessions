# Module Organization

We have been adding services and potentially reusable components into the AppModule and CollectionModule in the case of the HideIfUnauthorized directive. This directive could be used in other modules as well, so we should create a shared module. Also, the AppModule is getting bloated and some of this code can be moved into a core module.

## Step 1 - Add Shared Module

**Best practices for Shared Module:**
1. shared directives, components, and pipes
2. imports CommonModule
3. exports CommonModule, so that we don't need to import it again in every feature module
4. import as many times as needed into multiple modules

### shared.module.ts
Create a shared folder to hold the new module.
```
└──app/shared/shared.module.ts
```

```javascript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
      CommonModule
  ]
})
export class SharedModule { }
```

Modify the Collection Module to import the SharedModule and we can now remove the import of the CommonModule.

### collection.module.ts
```javascript
@NgModule({
  imports: [
    // CommonModule,
    SharedModule
```

### hide-if-unauthorized.directive.ts
Move the directives folder from under the collection folder to be under the shared folder and move the hide-if-unauthorized.directive.ts file as well.
```
└──app/shared/directives/hide-if-unauthorized.directive.ts
```

### shared.module.ts
Also delete the declaration of HideIfUnquthorizedDirective from the CollectionModule into the SharedModule.

```javascript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideIfUnauthorizedDirective } from './directives/hide-if-unauthorized.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HideIfUnauthorizedDirective
  ],
  exports: [
    CommonModule,
    HideIfUnauthorizedDirective
  ]
})
export class SharedModule { }

```

This directive uses AuthorizationService and ActionCode, but these were created in the AppModule. So, let's move these to a new Core module.

## Step 2 - Add Core Module
**Best practices for Core Module**
1. Shared Singleton Services
    1. those shared across multiple modules in the app
    2. injector will create another instance of a service for every lazy-loaded module that provides
2. App Level Components
    1. not components that are shared across the app
    2. components that are only used by the top-level app component
    3. for example, top-level navigation bar
3. Imports
    1. imports CommonModule
    2. also import module(s) that contain any directives you are using in the Core Module
    3. only import once into app/root module

### core.module.ts
Create a common folder to hold the new module.
```
└──app/core/core.module.ts
```

```javascript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
```

## Step 3 - Now that we have a CoreModule, move all shared services and models from the AppModule into the CoreModule

Create a services folder for the services and a models folder for the models.

### Services
1. auth-guard.service.ts
2. auth-interceptor.service.ts
3. auth.service.ts
4. authorization-data.service.ts
5. authorization.service.ts
6. error-handler.service.ts
7. error-notification-interceptor.service.ts
7. logging.service.ts
8. notification.service.ts

### Models
1. authorization.types.ts
2. logging.models.ts
3. notification-message.models.ts

### Move the providers from the AppModule to the CoreModule
Since we just moved these services into the CoreModule, it makes sense to also move the code that specifies to use them into the CoreModule as well. Also, we can go ahead and move the adal services into the CoreModule where the code is using these services.

```javascript
  providers: [
    AdalService, AdalGuard,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorNotificationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ]
```

Test to make sure the app builds and the directive still works as expected. The button should be visible when permission is 'UPDATE' and hidden when permission is 'ADMIN'.