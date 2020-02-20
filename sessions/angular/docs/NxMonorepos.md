# Nx - Monorepos
https://angular.io/guide/file-structure#multiple-projects
An extension to the Angular CLI

## Why Monorepo
It's all about code sharing. Multiple projects, but using libraries that are in the same code repository. This is instead of npm packages.

## Key topics
1. Nx workspaces
2. Apps
3. Libs

https://nrwl.io/
https://nx.dev/angular

## Create the workspace
https://nx.dev/angular/getting-started/getting-started

```
npx create-nx-workspace@latest myorg
```
Choose empty.
Make sure to choose "Angular CLI", not Nx

You'll see this message:
NX   NOTE  Nx CLI is not installed globally.
This means that you might have to use "yarn nx" or "npm nx" to execute commands in the workspace.
  Run "yarn global add @nrwl/cli" or "npm install -g @nrwl/cli" to be able to execute command directly.

So, should run ```npm install -g @nrwl/cli``` or throughout the lab, type ```npm nx ...```
```
cd myorg
ng add @nrwl/angular --defaults
```

## Create first app
```
ng g @nrwl/angular:application bookshelf-member-portal
```

Since we have an application under the workspace, we need to indicate which one to serve.
```
ng serve bookshelf-member-portal
```

## Create second app
```
ng g @nrwl/angular:application admin-portal
```

If we want to run both at once, we'll need to provide a different port number
```
ng serve admin-portal -p 4201
```

## Add libs
The app will just be a shell. All the real code will go into libs.
Let's add a lib for the AboutComponent which will be lazy loaded.
https://nx.dev/angular/guides/misc-lazy-loading#lazy-loading
```
ng generate @nrwl/angular:lib about --routing --lazy --parent-module=apps/bookshelf-member-portal/src/app/app.module.ts 
```

Add a component to the lib.
```
ng g component about --project=about --export
```

### about.module
Use the component
```javascript
    RouterModule.forChild([
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
      { path: '', pathMatch: 'full', component: AboutComponent }
    ])
```

### bookshelf-member-portal/.../app.component.ts
Add a link to the AboutComponent
```html
  <a [routerLink]="['/about']">ABOUT</a>
```

Note: The router-outlet is at the bottom of the page, so that's where you'll see it.

## Only rebuild affected files
https://nx.dev/web/tutorial/11-build-affected-projects

```
npm run affected:build
```

## Monorepo Tips and Best Practices
https://nx.dev/web/guides/monorepo-nx-enterprise
