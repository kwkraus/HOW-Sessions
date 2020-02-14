# Angular Libraries
Angular Package Format https://goo.gl/jB3GVv

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

## Create a new Angular project for our library
```
npx -p @angular/cli ng new library-demo-app
```
Add a folder my-common-services at the root (sibling of src).
Under my-common-services, create:
1. src folder
2. public_apis.ts
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
`"scripts": {
    "build-lib": "ng-packagr -p my-common-service/package.json"
}
```
## Create the libary
```
npm run build-lib
```