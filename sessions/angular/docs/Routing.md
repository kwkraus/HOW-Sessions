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
export class BookGuardService implements CanActivate {

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
          return false;
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

Test the guard by attempting to run the app and navigate to the book detail page with a non-numeric or invalid id.

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
```javascript
  constructor(. . .,
    private _route: ActivatedRoute)
```
```javascript
  ngOnInit() {
    //  this._dataService.getBooks().subscribe(books => {
    //   this.books = books;
    // });

    this.books = this._route.snapshot.data['books'];
  }
```

Run the app to make sure we are still getting the list of books for the collection component. Notice that now the user remains on the previous page while waiting for the resolver to get the data.

## Child Routes
Let's say we had book reviews that we want to show inside the book detail component.
We can create a BookReview component and nest it.
Another option is to create a child route to that component and pass in the book review index as a route parameter.
Note that the child can still acess the parent route information, which would make it more tightly coupled to the parent route.

## Create the BookReview component
```
ng g c collection/BookReview
```
### book.models.ts
Update the IBook model.

```javascript
export interface IBook {
    . . .
    bookReviews?: Array<IBookReview>;
}

export interface IBookReview {
  id: number;
  rating: number;
  title: string;
  description: string;
}
```

### data.service.ts
For demo purposes, hardcode some book reviews after the data is retrieved.

```javascript
  getBook(id: number): Observable<IBook> {
    return this._http.get<IBook>(`${this._booksUrl}/${id.toString()}`)
      .pipe(map(book => {
        book.bookReviews = [];
        for (let i = 0; i < 3; i++) {
          const text = book.rating === 5 ? 'Great book' : book.rating === 4 ? 'Good book' : 'Fair book';
          book.bookReviews.push({
            id: i + 1,
            title: `${text} #${i + 1}`,
            description: `${book.title} is a ${text}`,
            rating: book.rating
          });
        }
        return book;
      }),
      catchError(this.handleError)
      );
  }
```
### book-detail.component.html
```html
    <mat-card-content>
        . . .
      <div *ngIf="!bookId">
        <label>Reviews</label>
        <ul>
          <li *ngFor="let review of book.bookReviews">
            <a [routerLink]="['reviews', review.id]">
              {{ review.title }}
            </a>
          </li>
        </ul>
        <router-outlet></router-outlet>
      </div>
    </mat-card-content>
```

### collection-routing.module.ts
```javascript
  {
    path: ':id',
    canActivate: [BookGuardService],
    component: BookDetailComponent,
    children: [
      {
        path: 'reviews/:reviewId',
        component: BookReviewComponent
      }
    ]
  }
```

### book-review.component.ts
```javascript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { IBookReview } from '../../models/book.models';

@Component({
  selector: 'app-book-review',
  templateUrl: './book-review.component.html',
  styleUrls: ['./book-review.component.css']
})
export class BookReviewComponent implements OnInit, OnDestroy {

  sub: Subscription;
  review: IBookReview;

  constructor(private route: ActivatedRoute,
    private dataService: DataService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        const bookId = +this.route.snapshot.parent.params['id'];
        const reviewId = +params['reviewId'];
        this.dataService.getBook(bookId).subscribe(
          book => this.review = book.bookReviews!.find(review => review.id === reviewId));
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
```

### book-review.component.html
```javascript
<mat-card>
  <mat-card-header>
    <mat-card-title>
      <h4>{{review.title}}</h4>
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <label>Description: </label>
    <p>{{review.description}}</p>
  </mat-card-content>
</mat-card>
```
Run the app and navigate to the book detail page.
Click on reviews to see the child route navigation.
Set breakpoint in BookReview component to see what values are available on the route.