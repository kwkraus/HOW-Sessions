# Angular Libraries
Angular Package Format https://goo.gl/jB3GVv

Note: to start clean from the previous module
1. Remove the image search component from new-book
```html
  <image-search searchstring="{{book.title}}"
    subscriptionkey="5b53d2dde8fc42a3a66bae7a4291da6d"
    (imageUrlSelected)="book.coverUrl = $event.detail">
  </image-search>
```
2. Clear the scripts node in angular.json
```json
  "scripts": [
    "./node_modules/image-search/dist/polyfills.c78f934af02c23a04d15.js",
    "./node_modules/image-search/dist/polyfills-es5.8b0c7cc98c3f7ae85ca2.js",
    "./node_modules/image-search/dist/main.fbe290b5856eaa26f6e4.js"
  ]
``` 
3. Add the import of ```zone.js``` back into the polyfills.ts

## Steps to create an Angular Library
1. Inline all the templates
2. Compile with ngc
3. Build ESM2015, ESM5, and UMD formats
4. module definitions
5. typing file
6. aot metadata
7. entrypoint

## ng-packagr
Does all of these steps for us.
```
npm install -g ng-packagr
```
It takes as input public_api.ts, *.ts, and package.json

### Update package.json
```json
"ngPackage": {
    "lib": {
        "entryFile": "public_api.ts"
    },
    "dest": "dist"
},
```

### public_apis.ts
This is the entryFile - 1 per library.
Anything in the library that you want to expose outside the library must be included in this file.
```javascript
export * from './src/my-logger.service';
export * from './src/my-shared.module';
```

```javascript
import { MyLoggerService, MySharedModule } from 'my-library';
```

## Set up our project to include our library

Note: To create a new project without a globally install AngularCLI:
```
npx -p @angular/cli ng new library-demo-app
```

Add a folder my-common-services at the root (sibling of src).
Under my-common-services, create:
1. src folder
2. public_api.ts
3. package.json
```json
{
    "name": "my-common-services",
    "version": "0.0.1",
    "peerDependencies": {
        "@angular/core": ">=8.0.0"
    },
    "ngPackage": {
        "lib": {
            "entryFile": "public_api.ts"
        }
    },
    "dest": "dist"
}
```
From root of app:
```
npm install ng-packagr tsickle --save-dev
```
Update the package.json just updated to include a script to build our library.
```json
"scripts": {
    "build-lib": "ng-packagr -p my-common-services/package.json"
}
```
## Create the libary
```
npm run build-lib
```
Look at all the files that were created in the dist folder of the library project.

## Consume the library
Go to the main app and install the library into it.
```
npm install my-common-services/dist
```
### core.module.ts
Since we removed the NotificationService from this module, let's add a reference to the library's module here.

```javascript
import { MyCommonServicesModule } from 'my-common-services';

@NgModule({
  imports: [
    CommonModule,
    MyCommonServicesModule
  ], 
```

Now everything that was exported from that module is now imported into our application.

### error-notification-interceptor.service.ts
Replace the old import to reference the library.
```javascript
import { NotificationService } from 'my-common-services';
```

### app-component.ts
Replace the old import to reference the library.
```javascript
import { NotificationService } from 'my-common-services';
```
NOTE: If you are using the application from the last module which includes Angular Elements, you'll need to pull that in.
```
npm link ../angularelements_complete
```

## Run the app
Modify a link in data.service.ts to be invalid.
Set a breakpoint in error-notification-interceptor.service.ts inside catchError() and see that is calling into the library.

## Move the rating component into the library
Create a components folder under src.
Drag the rating folder from the app into the library components folder.

### my-common-service.module.ts
1. Register the rating component in the module.
2. Import the CommonModule to get the ngFor directive used in the component.
3. Export the RatingComponent to make it accessible.

```javascript
    imports: [
        CommonModule
    ],
    declarations: [
        RatingComponent
    ],
    exports: [
        RatingComponent
    ]
```

### package.json
Update the peerDependencies
```json
    "peerDependencies": {
        "@angular/core": ">=8.0.0",
        "@angular/common": ">=8.0.0"
    },
```
### public_api.ts
```javascript
export * from './src/components/rating/rating.component';
```
### collection.module.ts
Remove the declaration of the rating component in the module and instead import the module.

Remove:
```javascript
import { RatingComponent } from '../rating/rating.component';
. . .
  declarations: [
    RatingComponent,
```

Add:
```javascript
import { MyCommonServicesModule } from 'my-common-services';
. . .
  imports: [
    MyCommonServicesModule
  ],
```

## Rebuild the library
```
npm run build-lib
```

## Fix runtime error
Given this error, here is the fix.
https://stackoverflow.com/questions/53833985/no-provider-for-viewcontainerref-while-using-ng-packagr-component

### angular.json
```json
  "projects": {
    "angular-workshop": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "preserveSymlinks": true,
```

Another fix I needed to make was in angular.json.
Error: "Two or more projects are using identical roots. Unable to determine project using current working directory. Using default workspace project instead."
```json
    "angular-workshop-e2e": {
      "root": "e2e",
```
## Run the app and verify that the rating component is still working.

## Use the AngularCLI to create a library
AngularCLI now includes ng-packagr
```
ng generate library my-about-component
```
NOTE: To solve this error (ng generate library Cannot read property 'entries' of undefined), I had to upgrade the version of angular/pwa

This creates a folder named projects and a sub-folder named my-ui-components with these files (plus a few more):
1. ng-package,json
2. package.json
3. tsconfig.lib.json

Another sub-folder lib contains the public_api.ts file

It also updates the tsconfig.json of the main app, adding to the paths so that whenever we add an ES2015 import statement, the TS compiler will first look in the path and then look in the node_modules.

To build the library, we only need to add a script to the package.json.
```json
"build-my-about-component": "ng build my-about-component"
```
## Edit the component created in the library

### my-about.component.ts
```javascript
@Component({
  selector: 'lib-my-about',
  templateUrl: './my-about.component.html',
  styles: []
})
export class MyAboutComponent {
  pageTitle = 'The Common About Page';
}

```
### my-about.component.html
```html
<h3>{{pageTitle}}</h3>
<p>Some text about our company</p>
```

### public-api.ts
```javascript
export * from './lib/my-about.component';
```

### package.json
```json
"build-my-about-component": "ng build my-about-component",
```
Can also add a script to watch for changes and build.
```json
"watch-my-about-component": "ng build my-about-component --watch",
```

## Other install options
If we want to install into another application
```
npm install ../angularlibraries_complete/dist/my-about-component
npm install ../angularlibraries_complete/my-common-services/dist
```
### Option1: package.json
Notice that in addition to installing, these lines are added to the package.json
```json
    "my-about-component": "file:dist/my-about-component",
    "my-common-services": "file:my-common-services/dist",
```

###  Option 2: package.json
```json
"pack-my-about-component": "cd dist/my-about-component && npm pack",
"pack-my-common-services": "cd dist/common-services && npm pack"
```
This creates a .tgz file, which is identical to what would come from npm

Remove from package.json
```json
    "my-about-component": "file:dist/my-about-component",
    "my-common-services": "file:my-common-services/dist",
```

```
npm install ../angularlibraries_complete/dist/my-about-component/my-about-component-0.0.1.tgz
npm install ../angularlibraries_complete/my-common-services/dist/my-common-services-0.0.1.tgz
```
With the tgz files, we can remove the ```"preserveSymlinks": true,``` from angular.json file.

## Library Best Practices
https://angular.io/guide/creating-libraries#refactoring-parts-of-an-app-into-a-library
