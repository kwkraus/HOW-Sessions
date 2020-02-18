# Unit Testing with Jasmine and Karma

## Show test runner config

### karma.conf.js

### test.ts
Start with hellotesting.spec.ts
```javascript
const context = require.context('./app', true, /hellotesting\.spec\.ts$/);
```

## Run from command line or terminal

```
ng test
```
View output.

Now, run existing tests for collection component.
```javascript
const context = require.context('./app/collection/book-collection', true, /collection.component\.spec\.ts$/);
```

Then, run all spec files in the collection module.
```javascript
const context = require.context('./app/collection', true, /\.spec\.ts$/);
```
And, our newly added BookReview component is failing.

Note: that anything that the component needs (even in the template) must be included in the TestBed.
```javascript
      imports: [
        MatSnackBarModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        RouterTestingModule
      ],
```

Try again.

Now it needs the HttpClient. Show that any dependencies will cascade through the constructors and need all their dependencies. Instead of providing HttpClient, we can mock the data service.

```javascript
  beforeEach(async(() => {
    const mockDataService = jasmine.createSpyObj(['deleteBook', 'getBooks', 'getBook', 'addBook', 'search', 'updateBook']);

    TestBed.configureTestingModule({
        . . .
      providers: [
        { provide: DataService, useValue: mockDataService }
      ]
```

Now, we have a broken test ```TypeError: Cannot read property 'title' of undefined```
Show how to debug in the browser.
We have not populated the data in the route, so we need to mock that as well.

```javascript
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: ActivatedRoute, useValue: {
          params: of({ reviewId: '1' }),
          snapshot: { parent: {
              params: { id: '1' }}}
        }}
      ]
```

Now, need an implementation of getBook()
```javascript
    const book = { id: 1, title: 'Angular Rocks!', author: 'Fred Flinstone', isCheckedOut: true, rating: 5, bookReviews: []};

    mockDataService.getBook.and.returnValue(of(book));
```

So, it turns out, we have an actual bug. If there are no reviews for the id pass in on the route, the component crashes. Let's fix the component.

### book-review.component.ts
```javascript
<mat-card *ngIf="review">
```

As long as it's working, let add another test.

```javascript
  it('should set empty review', () => {
    expect(component.review).toBeFalsy();
  });
```

Then, test all spec files.
Point out how 
```const context = require.context('./', true, /\.spec\.ts$/);```

DataService now fails because we introduced the AppConfig service.

### data.service.spec.ts
```javascript
import { AppConfig } from '../app.config';

  beforeEach(() => {
    class MockAppConfig {
      static settings = {
          apiServer: {
              books: 'https://bookservicelaurie.azurewebsites.net/api/'
          }
      };
    }
    AppConfig.settings = <any>MockAppConfig.settings;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
  });
```

### angular.json
You can add extra configuration
```json
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "src/test.ts",
            "karmaConfig": "./karma.conf.js",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.spec.json",
            "codeCoverageExclude": [
              "src/app/**/*data.service.*",
              "src/app/core-controls-demo/*.*",
              "src/app/**/*-resolver.service.*"
            ],
            "scripts": [
            ],
            "styles": [
              "node_modules/primeicons/primeicons.css",
              "node_modules/primeng/resources/themes/bootstrap/theme.css",
              "node_modules/primeng/resources/primeng.css",
              "node_modules/font-awesome/css/font-awesome.css",
              "src/variables.less",
              "src/styles.css"
            ],
            "assets": [
              "src/assets",
              "src/favicon.ico",
              "src/web.config"
            ]
          }
        },
```

## Get Code Coverage
```
ng test --code-coverage
```

## Add some tests to RatingComponent

### rating.component.spec.ts
Add new test

```javascript
  it('should emit the new rating', () => {
    component.rating = 1;
    const newRating = 5;
    spyOn(component.ratingClicked, 'emit');
    component.click(newRating);
    expect(component.ratingClicked.emit).toHaveBeenCalledWith(newRating);
  });
```


