# Advanced Routing Topics

## Route Guards
https://angular.io/guide/router#milestone-5-route-guards

## Block access to BookDetail with invalid id

### guards/book-guard.service.ts
```javascript
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Injectable({ providedIn: 'root' })
export class BookGuardService {

  constructor(private router: Router, private dataService: DataService) { }

  canActivate(route: ActivatedRouteSnapshot) {
   // get the book id from the route.
   // Note:+ ensures that the value is returned as number and not string
    const id = +route.params['id'];
    if (isNaN(id)) {
      // optionally, redirect to an appropriate
      this.router.navigate(['/collection']);
      return false;
    }

    return this.dataService.canActivate(id).pipe(
        map(result => {
          if (result) {
              return true;
          }
          this.router.navigate(['/collection']);
          return of(false);
        }),
        catchError(() => {
          this.router.navigate(['/collection']);
          return of(false);
        })
    );
  }
}
```

### collection-routing.module.ts
```javascript
const routes: Routes = [
  {
    path: ':id',
    canActivate: [BookGuardService],
    component: BookDetailComponent
  }
];
```

## Route Resolvers
https://angular.io/guide/router#resolve-pre-fetching-component-data

### collection/book-collection/collection.resolver.ts
```javascript
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook } from '../../models/book.models';
import { DataService } from '../../services/data.service';

@Injectable({ providedIn: 'root' })
export class CollectionResolver implements Resolve<IBook[]> {
    constructor(private dataService: DataService) {}

    resolve(): Observable<IBook[]> {
        return this.dataService.getBooks();
    }
}
```

### collection-routing.module.ts
```javascript
const routes: Routes = [
  {
    path: '',
    component: CollectionComponent,
    resolve: { books: CollectionResolver }
  },
```

### collection.component.ts
```diff
  ngOnInit() {
-     this._dataService.getBooks().subscribe(books => {
-      this.books = books;
-    });

+    this.books = this._route.snapshot.data['books'];
  }
```

## Child Routes
-- Let's say we had book review that we want to show inside the book detail component.
-- We can create a BookReview component and nest it.
-- Another option is to create a child route to that component and pass in the book review index as a route parameter.
-- Note that the child can still acess the parent route information, which would make it more tightly coupled to the parent route.