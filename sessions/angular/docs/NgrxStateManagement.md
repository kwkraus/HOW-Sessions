# Ngrx State Management
https://ngrx.io/

https://ngrx.io/guide/store#diagram

https://ngrx.io/docs#when-should-i-use-ngrx-for-state-management

## Start with ngrx_workshop_v9

## Add the required libraries
We could add dependencies to package.json and then start creating reducers, etc.
However, we can use schematics to add it for us.
https://ngrx.io/guide/store/install#installing-with-ng-add

```
ng add @ngrx/store
```

Look at package.json
```json
    "@ngrx/store": "~8.6.0",
    "@ngrx/store-devtools": "~8.6.0",
    "@ngrx/effects": "~8.6.0",
    "@ngrx/entity": "~8.6.0",
```
