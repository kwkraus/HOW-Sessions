import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionComponent } from './collection.component';

import { DataService } from '../../services/data.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IBook } from '../../models/book.models';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../../rating/rating.component';
import { By } from '@angular/platform-browser';

describe('CollectionComponent', () => {
  let fixture: ComponentFixture<CollectionComponent>;
  let component: CollectionComponent;
  let mockDataService;
  let books: Array<IBook>;

  beforeEach(async(() => {
    mockDataService = jasmine.createSpyObj(['deleteBook', 'getBooks', 'addBook', 'search', 'updateBook']);

    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        CollectionComponent,
        RatingComponent,
      ],
      providers: [
        { provide: DataService, useValue: mockDataService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);

    component = fixture.componentInstance;

    books = [
      { id: 1, title: 'Angular Rocks!', author: 'Wael Kdouh', isCheckedOut: true, rating: 5 },
      { id: 2, title: 'Node Rocks!', author: 'Wael Kdouh', isCheckedOut: false, rating: 5 }
    ];

    mockDataService.search.and.returnValue(of(books));

    // You need to call detectChanges to cause life cycle events to run
    fixture.detectChanges();
  });

  it('should create the collection component', () => {
    expect(component).toBeTruthy();
  });


  it('should set books correctly from the service', () => {
    expect(component.books.length).toBe(2);
  });

  it('should set books correctly from the service after adding a book', () => {
    books.push({ id: 3, title: 'Web Rocks!', author: 'Wael Kdouh', isCheckedOut: false, rating: 5 });
    mockDataService.addBook.and.returnValue(of(books));
    expect(component.books.length).toBe(3);
  });

  it('should create two material list items', () => {
    const ne = fixture.debugElement.nativeElement;
    expect(ne.querySelectorAll('.mat-list-item').length).toBe(2);
  });

  it('should create two my-rating child components', () => {
    const appRatingComponentDEs = fixture.debugElement.queryAll(By.directive(RatingComponent));
    expect(appRatingComponentDEs.length).toEqual(2);
  });


  it('Ensure that all rating components are receiving a rating between 1 and 5', () => {
    const appRatingComponentDEs = fixture.debugElement.queryAll(By.directive(RatingComponent));
    for (let index = 0; index < appRatingComponentDEs.length; index++) {
      expect(appRatingComponentDEs[index].componentInstance.rating >= 1 &&
             appRatingComponentDEs[index].componentInstance.rating <= 5).toBeTruthy();
    }
  });

});
