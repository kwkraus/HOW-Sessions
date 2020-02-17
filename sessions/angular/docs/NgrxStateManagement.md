# Ngrx State Management
https://ngrx.io/

https://ngrx.io/guide/store#diagram

https://ngrx.io/docs#when-should-i-use-ngrx-for-state-management

## Start with ngrx_start

## Add the required libraries
We could add dependencies to package.json and then start creating reducers, etc.
However, we can use schematics to add it for us.
https://ngrx.io/guide/store/install#installing-with-ng-add

```
ng add @ngrx/store
```

Output:
```
Installing packages for tooling via npm.
Installed packages for tooling via npm.
CREATE src/app/reducers/index.ts (359 bytes)
UPDATE src/app/app.module.ts (2663 bytes)
UPDATE package.json (1554 bytes)
```
Look at package.json
Also, add the other 3 libraries that we'll be using

```json
    "@ngrx/store": "~8.6.0",
    "@ngrx/store-devtools": "~8.6.0",
    "@ngrx/effects": "~8.6.0",
    "@ngrx/entity": "~8.6.0",
```

## Start coding with Actions
https://ngrx.io/guide/store/actions#actions

### app/collection/actions/books-api.actions.ts
```javascript
import { createAction, props } from '@ngrx/store';
import { IBook } from '../../models/book.models';

export const booksLoaded = createAction(
  '[Books API] Books Loaded Success', props<{ books: Array<IBook> }>()
);

export const bookLoaded = createAction(
    '[Books API] Book Loaded Success', props<{ book: IBook }>()
);

export const bookCreated = createAction(
  '[Books API] Book Created', props<{ book: IBook }>()
);

export const bookUpdated = createAction(
  '[Books API] Book Updated', props<{ book: IBook }>()
);

export const bookDeleted = createAction(
  '[Books API] Book Deleted', props<{ book: IBook }>()
);

export const bookDeleteFailed = createAction(
    '[Books API] Book Delete Failed', props<{ book: IBook }>()
);

export type BooksApiActions = ReturnType<
    typeof booksLoaded | typeof bookLoaded | typeof bookCreated | typeof bookUpdated | typeof bookDeleted>;
```

### app/collection/actions/books-ui.actions.ts
```javascript
import { createAction, props } from '@ngrx/store';
import { IBook } from '../../models/book.models';

export const init = createAction('[Collection Page] Init');

export const getBook = createAction(
    '[Book Detail Page] Init', props<{ bookId: number }>()
);

export const createBook = createAction(
  '[Collection Page] Create Book', props<{ book: IBook }>()
);

export const updateBook = createAction(
  '[Collection Page] Update Book', props<{ book: IBook; changes: IBook }>()
);

export const deleteBook = createAction(
  '[Collection Page] Delete Book', props<{ book: IBook }>()
);

export type BooksActions = ReturnType<
    typeof init | typeof getBook | typeof createBook |
    typeof updateBook | typeof deleteBook
>;
```

### app/collection/actions/index.ts
```javascript
import * as BooksApiActions from './books-api.actions';
import * as BooksUIActions from './books-ui.actions';

export { BooksUIActions, BooksApiActions };
```

## After Actions, next code Reducers
https://ngrx.io/guide/store/reducers#reducers

Since we need to manage record collection, we will use Entity State in our reducer.
https://ngrx.io/guide/entity#ngrxentity

NOTE: We already added it to the package.json

### app/reducers/books.reducer.ts
```javascript
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector, createReducer, on, Action } from '@ngrx/store';
import { IBook } from '../models/book.models';
import { BooksUIActions, BooksApiActions } from '../collection/actions';

// export const initialBooks: Array<IBook> = [];
// https://ngrx.io/guide/entity/adapter#entity-adapter
export interface State extends EntityState<IBook> {
    //No need to declare the books array, since we get that from EntityState<IBook>
    activeBookId: number | null;
}

// Entity State uses an Adapter to manage the collection of books
export const adapter = createEntityAdapter<IBook>();

export const initialState = adapter.getInitialState({
  activeBookId: null
});

// NOTE: If we had a non-collection state, we could skip Entities and Adapter.
// Instead the reducer would look like this:
// export const initialState: State = {
//     name: '',
//     value: 0,
// };
// https://ngrx.io/guide/store/reducers#setting-the-initial-state
// https://ngrx.io/guide/store/reducers#creating-the-reducer-function

export const bookReducer = createReducer(
    initialState,
    on(BooksApiActions.booksLoaded, (state, { books }) => {
        return adapter.addAll(books, state);
    }),
    on(BooksApiActions.bookLoaded, (state, { book }) => {
        return {
            ...state,
            activeBookId: book.id
          };
    }),
    on(BooksApiActions.bookCreated, (state, { book }) => {
        return adapter.addOne(book, {
            ...state,
            activeBookId: book.id
        });
    }),
    on(BooksApiActions.bookUpdated, (state, { book }) => {
        return adapter.updateOne(
            { id: book.id, changes: book },
            { ...state, activeBookId: book.id }
        );
    }),
    on(BooksApiActions.bookDeleted, (state, { book }) => {
        return adapter.removeOne(book.id, {
            ...state,
            activeBookId: null
        });
    })
);

export function reducer(state: State | undefined, action: Action) {
    return bookReducer(state, action);
  }

// Entity Selectors
// The getSelectors method returned by the created entity adapter provides functions
//   for selecting information from the entity.
// The getSelectors method takes a selector function as its only argument to select
//   the piece of state for a defined entity.
export const { selectAll, selectEntities } = adapter.getSelectors();
export const selectActiveBookId = (state: State) => state.activeBookId;
export const selectActiveBook = createSelector(selectEntities, selectActiveBookId,
    (entities, bookId) => (bookId ? entities[bookId] : null));
```

### app/reducers/index.ts
```javascript
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as fromBooks from './books.reducer';

export interface State {
  books: fromBooks.State;
}

export const reducers: ActionReducerMap<State> = {
  books: fromBooks.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

// Selectors
export const selectBooksState = createFeatureSelector<fromBooks.State>('books');

export const selectAllBooks = createSelector(
  selectBooksState,
  fromBooks.selectAll
);

export const selectActiveBook = createSelector(
  selectBooksState,
  fromBooks.selectActiveBook
);
```

## After Actions and Reducers, add Effects
https://ngrx.io/guide/effects

### app/collection/effects/book-api.effects.ts
```javascript
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BooksApiActions, BooksUIActions } from '../actions';

import { mergeMap, map, catchError, exhaustMap, concatMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { DataService } from '../../services/data.service';

@Injectable()
export class BooksApiEffects {
  loadBooks$ = createEffect(() => this.actions$.pipe(
    ofType(BooksUIActions.init.type),
    exhaustMap(() =>
      this.dataService.getBooks().pipe(
        map(books => BooksApiActions.booksLoaded({ books })),
        catchError(() => EMPTY)
      )
    )
  ));

  loadBook$ = createEffect(() => this.actions$.pipe(
    ofType(BooksUIActions.getBook.type),
    exhaustMap(action =>
      this.dataService.getBook(action.bookId).pipe(
        map(book => BooksApiActions.bookLoaded({ book })),
        catchError(() => EMPTY)
      )
    )
  ));

  createBook$ = createEffect(() => this.actions$.pipe(
    ofType(BooksUIActions.createBook.type),
    mergeMap(action =>
      this.dataService.addBook(action.book).pipe(
        map(book => BooksApiActions.bookCreated({ book })),
        catchError(() => EMPTY)
      )
    )
  ));

  updateBook$ = createEffect(() => this.actions$.pipe(
    ofType(BooksUIActions.updateBook.type),
    concatMap(action =>
      this.dataService.updateBook(action.changes).pipe(
        map(() => BooksApiActions.bookUpdated({ book: action.changes })),
        catchError(() => EMPTY)
      )
    )
  ));

  deleteBook$ = createEffect(() => this.actions$.pipe(
    ofType(BooksUIActions.deleteBook.type),
    mergeMap(action =>
      this.dataService.deleteBook(action.book.id).pipe(
        map(() => BooksApiActions.bookDeleted({ book: action.book })),
        catchError(() => EMPTY)
      )
    )
  ));

  constructor(private dataService: DataService,
    private actions$: Actions<BooksUIActions.BooksActions | BooksApiActions.BooksApiActions>) {}
}
```

### collection/effects/book-ui.effects.ts
```javascript
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';
import { BooksApiActions } from '../actions';

@Injectable()
export class BooksUiEffects {

    showUpdateSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(BooksApiActions.bookUpdated.type),
        map(({ book }) => this.showSnackBar(`"${book.title}" has been updated!`))
    ), { dispatch: false });

    showDeleteSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(BooksApiActions.bookDeleted.type),
        map(({ book }) => this.showSnackBar(`"${book.title}" has been deleted!`))
    ), { dispatch: false });

    private showSnackBar(message: string) {
        this.snackBar.open(message, 'DISMISS', {
            duration: 3000
        });
    }

    constructor(private actions$: Actions<BooksApiActions.BooksApiActions>,
        private snackBar: MatSnackBar) {}
}
```

### app.module.ts
```javascript
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([])
```
### collection.module.ts
```javascript
imports: [
    . . .
    EffectsModule.forFeature([BooksApiEffects, BooksUiEffects])
```

## Use the store wherever we read or update the book state

### book.detail.ts
```javascript
import * as fromRoot from '../../reducers';
  //  book: IBook;
  book$: Observable<IBook>;
  constructor(private store: Store<fromRoot.State>,
    . . .) {
    this.book$ = this.store.pipe(select(fromRoot.selectActiveBook));
  }

  getBook(id: number): void {
    this.store.dispatch(BooksUIActions.getBook({ bookId: id }));
  }

  onRatingUpdate(book: IBook, rating: number): void {
    this.updateBook(book, { ...book, rating: rating });
  }

  updateBook(oldBook: IBook, newBook: IBook): void {
    this.store.dispatch(BooksUIActions.updateBook({ book: oldBook, changes: newBook }));
  }

    // NOTE: We now show the snackbar using ngrx-effects
    // updateMessage(message: string, type: string, actionText: string = 'DISMISS') {
    // if (message) {
    //   this._snackBar.open(`${type}: ${message}`, actionText, {
    //     duration: 3000
    //   });
    // }
  }
```
```html
<div *ngIf="book$ | async; let book">
```

### book.collection.component.ts
```javascript
import * as fromRoot from '../../reducers';

  // books: Array<IBook>;
  books$: Observable<Array<IBook>>;
  constructor(private store: Store<fromRoot.State>,
    . . .) {
    this.books$ = this.store.pipe(select(fromRoot.selectAllBooks));
  }

  ngOnInit() {
    this.getBooks();
    // this._dataService.search(this.searchTerm$)
    //    .subscribe(books => {
    //      this.books = books;
    // });
  }

  onRatingUpdate(book: IBook, rating: number): void {
    this.updateBook(book, { ...book, rating: rating });
    // this.updateMessage(book.title, ' Rating has been updated');
  }

  updateBook(oldBook: IBook, newBook: IBook): void {
    this.store.dispatch(BooksUIActions.updateBook({ book: oldBook, changes: newBook }));
  }

  delete(book: IBook) {
    this.store.dispatch(BooksUIActions.deleteBook({ book: book }));
  }

  getBooks(): void {
    this.store.dispatch(BooksUIActions.init());
  }

  addBook(): void {
    . . .
    dialogRef.afterClosed().subscribe(newBook => {
      if (newBook) {
        this.store.dispatch(BooksUIActions.createBook({ book: newBook }));
      }
    });
  }
```

```html
<mat-list-item *ngFor="let book of books$ | async">
```

## Add Redux Dev Tools
Add Chrome extension Redux DevTools

### package.json
```json
"@ngrx/store-devtools": "~8.6.0",
```

### app.module.ts
```javascript
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
. . .
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    })
```

## Show in Dev Tools
Note that there is a bug detected.
1. The activeBookId is not cleared when the user navigates back to the collection page

How would we fix this?
Do we need a new Action or can we use an existing one?
Maybe we could pass in null to the getBook action.
Should we create a new clearBook action.
Actually, if we look at the actions in the DevTools, we see that [Collection Page] Init is called, but we are ignoring it in our books reducer.

### books.reducer.ts
```javascript
export const bookReducer = createReducer(
    initialState,
    on(BooksUIActions.init, () => {
        return initialState;
    }),
```
