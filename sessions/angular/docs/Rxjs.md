# Making apps more reactive with RxJS
Focus on observable streams instead of assigning data to an array or object after retrieval.

NOTE: Just comment out the changed code because at the end of this module, we will return the code to its original state. This is because the ngrx module makes similar changes and we'll want to start fresh.

## Replace subscribe with async pipe

### collection-routing.module.ts
Revert data access from resolver.

```javascript
  {
    path: '',
    component: CollectionComponent
    // resolve: { books: CollectionResolver }
  },
```
### collection.component.ts

```javascript
  ngOnInit() {
     this._dataService.getBooks().subscribe(books => {
      this.books = books;
    });

    // this.books = this._route.snapshot.data['books'];
    . . .
  }
```

Instead of subscribing to the response to the API call, send the observable directly onto the page.
We'll need to fix the search as well, but for now, just comment it out.
```javascript
    // books: Array<IBook>;
    books$: Observable<Array<IBook>>;
    ngOnInit() {
        //  this._dataService.getBooks().subscribe(books => {
        //   this.books = books;
        // });
        this.books$ = this._dataService.getBooks();

        // this._dataService.search(this.searchTerm$)
        //     .subscribe(books => {
        //         this.books = books;
        // });
    });
  }
```
We need to fix the getBooks() method as well since it uses the subscribe(). For now, let's just comment it out and come back to it later.

```javascript
  getBooks(): void {
  //   this._dataService.getBooks().subscribe(
  //     books => this.books = books,
  //     error => this.updateMessage(<any>error, 'ERROR'));
  }
```

### collection.component.html
Modify the template to use the observable instead of the books array.a.
```html
  <div *ngIf="!books$">Retrieving books...</div>

  <mat-list *ngIf="books$ | async as books">
```

Run the app to make sure it is still working.

## Handling errors
Note that the data.service is catching any errors from the http request, logging, and then throwing a newly created error message.
The UI is ignoring it though.
```javascript
    this.books$ = this._dataService.getBooks()
      .pipe(
        catchError(err => {
          // show error on the screen
          return EMPTY; // an observable that emits no items and completes
          // We could have optionally populated some default data
        })
    );
```

## Point directly to observable in data service
By removing the method calls in the data service and instead subscribing directly to the observable, we can create a more reactive application.

Using the wide varietyof RxJS operators, this will allow components to combine streams and share observables across components, and even combine with user actions.

### data.service.ts
Remove the getBooks() method and instead create a public property $books that is assigned the result of the http.get().

```javascript
  // getBooks(query?: string): Observable<IBook[]> {
  //   return this._http.get<IBook[]>(this._booksUrl)
  books$: Observable<IBook[]> = this._http.get<IBook[]>(this._booksUrl)
      .pipe(
        map((books: IBook[]) => {
          // Remove the filtering from here.
          // We will handle this elsewhere to combine with user action.

          // if (query != null && query.length > 0) {
          //   books = books.filter(
          //     data =>
          //       data.author.includes(query) ||
          //       data.title.includes(query)
          //   );
          // }
          return books;
        }),
        catchError(this.handleError)
      );
```

Wherever ```this.getBooks()``` is called in data.service, it needs to be replaced by ```this.books$```.

And, anywhere that calls ```this._dataService.getBooks()``` needs to be replaced with this._dataService.books$

### collection.component.ts
```javascript
  books$ = this._dataService.books$
  .pipe(
    catchError(err => {
      return EMPTY; 
    })
  );

  // ngOnInit() {}

  // This method is called to refresh the screen after a book is added or deleted.
  // We'll need to find another way to do this.
  getBooks(): void {
  //  this._dataService.getBooks().subscribe(
  //    books => this.books = books,
  //    error => this.updateMessage(<any>error, 'ERROR'));
  }
```

## Fix the search function
The existing app, uses an observable to handle keyboard input and filter the list of books. We'd like to combine that observable with the books$ observable that we just created.

### collection.component.ts
Create another observable property.
Note: combineLatest() will not execute until both observable emit a value.
When we start, the user has not entered a search term, so the screen is blank.
This solution uses the startWith() operator, but we also could have changed ```searchTerm$ = new Subject<string>();``` to use BehaviorSUbject and initialized it to ''.

```javascript
  filteredBooks$ = combineLatest([this.books$,
    this.searchTerm$.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged())
    ])
    .pipe(
      map(([books, term]) => {
        return books.filter(
          book => term ? (book.author.includes(term) || book.title.includes(term)) : true);
      })
    );
```

Run the app and make sure we can now filter the results.

## Refresh data after add or delete

### data.service.ts
The refresh needs to be triggered by something. One solution is to add a method to the data service that components can call.

### data.service.ts
```javascript
  private refreshBooksSubject = new Subject<void>();

  refreshBooks() {
    this.refreshBooksSubject.next();
  }
```

Now, we need to use this observable to trigger the http.get. We can do that by using switchMap().

```javascript
  books$ = this.refreshBooksSubject.pipe(
    startWith(null),
    switchMap(() => this._http.get<IBook[]>(this._booksUrl)
    .pipe(
      catchError(this.handleError)
    )
  ));
```

### collection.component.ts
Now we just need to call the refresh method when the user adds or removes a book from the collection.

```javascript
  getBooks(): void {
    this._dataService.refreshBooks();
  }
```
