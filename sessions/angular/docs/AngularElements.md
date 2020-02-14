# Angular Elements
Angular Elements allow us to build web components which can be consumed by other non-Angular applications. We'll build a web component that allows the user to search for an image using Bing Search and get the url back. Then, we'l consume that web component in our library app and also in a simple html page.

## Areas where Angular Elements could be useful

1. Elements in Apps
    1. CMS embeds
    2. Dynamic components
    3. Server-side/hybrid rendering

2. Element Containers
    1. Mini-apps
    2. Micro-frontends
    3. ngUpgrade
    4. SharePoint

3. Reusable Widgets
    1. Cross-framework compatibility
    2. Material/CDK components in any environment
    3. Design systems - build once, use anywhere

## Create an empty application using the Angular CLI v9
Show the running app.
Go to the Azure portal and create a Bing Image Search Cognitive Service.
Make note of the URL and subscription key.
Show the documentation.

## Update config with subscription key

### config.dev.json
```json
    "cognitiveApiService": {
        "subscriptionKeys": {
            "bingSearch": "ecdcc32fbd20470fa8642beab002e281"
        }
    }
```
## Add angular-elements to the application
```
ng add @angular/elements
```

## Add a folder for our ImageSearch component
```
└──app/image-search
```

## Add folder for models and add bing-search models there
```
└──app/models
```

```javascript
export interface IBingSearchResult {
    value: Array<IBingMediaSearch | IBingNewsSearch>;
}

export interface IBingMediaSearch {
    name: string;
    webSearchUrl: string;
    thumbnailUrl: string;
    motionThumbnailUrl: string;
    contentUrl: string;
    hostPageUrl: string;
    hostPageDisplayUrl: string;
    width: number;
    height: number;
    thumbnail: {
        width: number;
        height: number;
    };
    hoveredOver: boolean;
}

export interface IBingNewsSearch {
    name: string;
    url: string;
    image: {
        thumbnail: {
            contentUrl: string;
            width: number;
            height: number;
        };
    };
    description: string;
    displayUrl: string;
    snippet: string;
}
```

## Add folder for services and add bing-search service there
```
└──app/services
```

```javascript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IBingSearchResult, IBingMediaSearch } from '../models/bing-search.models';

@Injectable({ providedIn: 'root' })
export class BingSearchService {

    constructor(private http: HttpClient) { }

    private handleError(error: any) {
      const errMsg = (error.message) ? error.message : error.status ?
        `${error.status} - ${error.statusText}` : 'Server error';
      return throwError(errMsg);
    }

    getImages(keyword: string, subscriptionKey: string) {
        const url = `https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${keyword}&count=10&safeSearch=Strict`;

        const options = {
            headers: new HttpHeaders({ 'Ocp-Apim-Subscription-Key': subscriptionKey })
        };
        return this.http.get<IBingSearchResult>(url, options)
            .pipe(map((searchResult) => {
                return this.getFormattedResults(searchResult);
            }),
                catchError(this.handleError)
            );
    }

    private getFormattedResults(searchResult: IBingSearchResult) {
        return (<IBingMediaSearch[]>searchResult.value).map(result => {
            return {
                contentUrl: result.contentUrl,
                thumbnailUrl: result.thumbnailUrl,
                name: result.name
            };
        });
    }
}
```

## Create the component
```
└──app/image-search
```

### image-search.component.ts
```javascript
import { ɵdetectChanges, Input, Component, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BingSearchService } from '../services/bing-search.service';

@Component({
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ImageSearchComponent implements OnDestroy {

    private subscription: Subscription;
    imageResults: Array<{
        contentUrl: string;
        thumbnailUrl: string;
        name: string;
    }> = [];

    @Input() title = 'Search for image';
    @Input() searchstring: string;
    @Input() subscriptionkey: string;
    @Output() imageUrlSelected = new EventEmitter<string>();
    @Output() thumbnailUrlSelected = new EventEmitter<string>();

    constructor(private bingSearchService: BingSearchService) {}

    search() {
        this.subscription = this.bingSearchService.getImages(this.searchstring, this.subscriptionkey)
            .subscribe(result => {
                this.imageResults = result.map(r => {
                    return {
                        contentUrl: r.contentUrl,
                        thumbnailUrl: r.thumbnailUrl,
                        name: r.name
                    };
                });
            });
    }

    select(index: number) {
        this.imageUrlSelected.emit(this.imageResults[index].contentUrl);
        this.thumbnailUrlSelected.emit(this.imageResults[index].thumbnailUrl);
        this.imageResults = [];
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
```
### image-search.component.html
```javascript
<mat-card>
    <mat-card-header>
        <mat-card-title>{{title}}</mat-card-title>
        <mat-card-subtitle>{{searchstring}}</mat-card-subtitle>
    </mat-card-header>
    <mat-card-content class="container">
        <mat-card *ngFor="let url of imageResults, index as i" class="result-card">
            <p>{{url.name}}</p>
            <img mat-card-image [src]="url.thumbnailUrl">
            <button mat-button (click)="select(i)">SELECT</button>
        </mat-card>
    </mat-card-content>
    <mat-card-actions>
        <button *ngIf="searchstring && imageResults?.length === 0"
            mat-button (click)="search()">SEARCH</button>
    </mat-card-actions>
</mat-card>
```

### image-search.component.css
```css
mat-card-content.container {
    display: flex;
    flex-wrap: wrap;
    width: 800px;
}
.result-card {
    max-width: 200px;
    background-color: cornflowerblue;
    border-color: darkblue;
    margin: 15px;
}
```

## Create the custom element that is a wrapper for the component
### image-search.element.ts
```javascript
import { ImageSearchComponent } from './image-search.component';
import { ɵrenderComponent, ɵdetectChanges } from '@angular/core';

export class ImageSearchElement extends HTMLElement {
    private comp: ImageSearchComponent;

    constructor() {
        super();
        this.comp = ɵrenderComponent(ImageSearchComponent, { host: this });
        this.comp.imageUrlSelected.subscribe((eventInfo: string) =>
            this.dispatchEvent(new CustomEvent('image-url-results', { detail: eventInfo })));
        this.comp.thumbnailUrlSelected.subscribe((eventInfo: string) =>
            this.dispatchEvent(new CustomEvent('thumbnail-url-results', { detail: eventInfo })));
    }

    get searchstring(): string {
        return this.comp.searchstring;
    }

    set searchstring(searchstring: string) {
        this.comp.searchstring = searchstring;
        ɵdetectChanges(this.comp);
    }

    get subscriptionkey(): string {
        return this.comp.subscriptionkey;
    }

    set subscriptionkey(key: string) {
        this.comp.subscriptionkey = key;
        ɵdetectChanges(this.comp);
    }
}
```

## Register the custom element with the browser
This can be done in different places, but we'll do it in the App Module.
```javascript
export class AppModule {
  constructor(private injector: Injector) {
  }
  ngDoBootstrap() {
    const imageSearchElement = createCustomElement(
      ImageSearchComponent, { injector: this.injector });
    customElements.define('image-search', imageSearchElement);
  }
}
```

Include the module imports that we need in the AppModule as well.
```javascript
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
```
Remove the declaration and bootstrapping of the AppModule. The web component does not use it.

## Add the custom component to the index.html page
We should be able to use this custom component anywhere, so we insert it on the index.html page.

Remove the <app-root> since we are not loading the app component.

```javascript
<body>
  <image-search id="imageSearch" searchstring='pandas' subscriptionkey="5b53d2dde8fc42a3a66bae7a4291da6d"></image-search>
  <h4>Selected image</h4>
  <img id="imageResult" width="400px" />
  <script>
    const element = document.getElementById('imageSearch');
    element.addEventListener('imageUrlSelected', e => {
      if (e) {
        document.getElementById('imageResult').setAttribute('src', e.detail);
      }
    });
  </script>
</body>
```

This will fail because the tsconfig file is sett to target E@5 which does bit include web components. We could modify the target in the tsconfig.json to be ES2015 or we can add polyfills so we can target older browsers.

## Add polyfills
https://www.webcomponents.org/polyfills

### package.json
```
    "@webcomponents/custom-elements": "~1.3.2"
```
### tsconfig.json
```javascript

// NOTE: one copy is zone.js is required.
// If this web component is used inside an Angular app,
// we need to remove this import from that container app
// and leave the import here in the web component
import 'zone.js/dist/zone';

// Used for browsers with parially native support of Custom Elements
import '@webcomponents/custom-elements/src/native-shim';

// Used for browsers without native support of Custom Elements
import '@webcomponents/custom-elements/custom-elements.min';
```

Now when we run, it should work.

## Distribution of our custom element
https://www.softwarearchitekt.at/aktuelles/%F0%9F%8C%BF%F0%9F%93%A6%F0%9F%85%B0%EF%B8%8F-web-components-custom-elements-with-angular-ivy-in-6-steps/

```
ng build --prod
```
will generate multiple bundles for consumers. ES5 and ES2015.
It will create multiple js files which will be difficult to distribute.

```
ng add ngx-build-plus
```

which updates angular.json file
```
"builder": "ngx-build-plus:build"
--single-bundle
```
Use the single-bundler flag
```
ng build --prod --single-bundle
```
Open IIS and add a web app that points to the dist folder.

## Use this web component within the previous application to get book covers - angularelements-app_complete

### assets
Copy the generated JS files from the dist folder.
Include the main.#.js plus polyfills.#.js and polyfills-es5.#.js

### angular.json
Make sure the polyfills JS files come before main.js
```json
    "scripts": [
        "src/assets/polyfills.c78f934af02c23a04d15.js",
        "src/assets/polyfills-es5.8b0c7cc98c3f7ae85ca2.js",
        "src/assets/main.fbe290b5856eaa26f6e4.js"
    ]
```
### book.models.ts
Add another property for the url to book cover
```javascript
export interface IBook {
  id: number;
  title: string;
  author: string;
  isCheckedOut: boolean;
  rating: number;
  coverUrl: string;
}
```

## Include web component on AddBook component

### new-book.component.html
```html
      <image-search searchstring="{{book.title}}"
        subscriptionkey="5b53d2dde8fc42a3a66bae7a4291da6d"
        (imageUrlSelected)="book.coverUrl = $event.detail">
      </image-search>
      <img [src]="book.coverUrl" style="max-width: 150px" />
```
### collection.module.ts
Try running first to see error, but will need to allow web components in the Angular app by adding this to the module.
```javascript
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
```

## Update polyfills

### polyfills.ts
There can only be one instance of zone.js
```javascript
// import 'zone.js/dist/zone';
```

https://stackoverflow.com/questions/56837900/how-to-import-angular-web-component-in-another-angular-app

