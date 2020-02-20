# Angular HOW Session Documentation

## Topics
1. [Configuration for different environments](docs/Configuration.md)

2. [Advanced Routing](docs/Routing.md)
- route guards
- resolvers
- child routes

3. [Reactive Forms](docs/ReactiveForms.md)
- dynamically create controls and apply validation rules via code

4. [Unit testing using Jasmine and Karma](docs/UnitTesting.md)

5. [TypeScript Inheritance in TypeScript](https://github.com/laurieatkinson/ng-patterns-demo)
- Demo: Patterns for code reuse within a project using class
- DemoTransactionComponent, ChildComponent1 - protected properties and methods

6. [RxJS](docs/Rxjs.md)
- Making apps more reactive

7. [Application Insights](docs/AppInsights.md)

8. [Http Interceptors](docs/HttpInterceptors.md)

9. [Authentication using Azure AD](docs/Authentication.md)

10. [Authorization](docs/Authorization.md)
– hide/disable menu items
- hide/disable controls
- block pages by permission

11. [Module Organization](docs/ModuleOrganization.md)

12. [Angular Elements](docs/AngularElements.md)
- for non-Angular applications
- for component reuse in other projects

13. [Angular Libraries](docs/AngularLibraries.md)
- for code reuse

14. [Creating a component library](https://github.com/laurieatkinson/ng-patterns-demo)
- Demo: custom controls

15. [Nx](docs/NxMonorepos.md)
-  tool from Nrwl for sharing code in a monorepo for multiple Angular applications

16. [State management with Ngrx](docs/NgrxStateManagement.md)

17. [Progressive Web Apps (PWAs)](docs/PWA.md)


These modules refer to two applications.
1. **Patterns Demo**: https://github.com/laurieatkinson/ng-patterns-demo
2. **Library App**: src/ng_workshop is the starter app before any lab instructions

The **Patterns Demo** is a complete application with many features including many features in this HOW session.

The **Library App** is the application built in the Intro Workshop. Features can be added to it in this HOW Session.

**Student setup notes**
- Open docs in the browser to follow along and also to have access to copy/paste of larger code snippets.
- git clone the angular folder
  - create a folder for your local repository
  - Open a command promt from that folder
  - git init
  - git remote add origin -f https://github.com/kwkraus/How-Sessions.git
  - git config core.sparsecheckout true
  - echo sessions/angular >> .git/info/sparse-checkout
  - git pull origin master

- With multiple apps in this repo with the same file names it can be confusing if you open VS Code at the root of the angular folder. Therefore, it is recommended that you open VS Code in the folder of the app that you are working in. That folder is ng_workshop.
- You may want to open a different instance of VS Code to view finished modules as a reference.


**Instructor delivery notes:**
- Make a copy of ng_workshop to work along with the students that will not be pushed to GitHub
- Do a git init and initial commit, so we can commit changes along the way.
- Open docs in the browser to have access to instructions.
- Open 1st instance of VS Code at the completed version of the first module and then as we complete each module, reopen VS Code in the completed version of each one.
- Open 2nd instance of VS Code at the ng_workshop_advanced folder (a copy of ng_workshop)

