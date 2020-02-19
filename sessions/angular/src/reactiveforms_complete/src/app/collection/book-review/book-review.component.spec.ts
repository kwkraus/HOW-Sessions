import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReviewComponent } from './book-review.component';
import { MatSnackBarModule, MatDialogModule, MatSlideToggleModule, MatCardModule, MatIconModule, MatListModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('BookReviewComponent', () => {
  let component: BookReviewComponent;
  let fixture: ComponentFixture<BookReviewComponent>;

  beforeEach(async(() => {
    const mockDataService = jasmine.createSpyObj(['deleteBook', 'getBooks', 'getBook', 'addBook', 'search', 'updateBook']);
    const book = { id: 1, title: 'Angular Rocks!!', author: 'Fred Flinstone', isCheckedOut: true, rating: 5, bookReviews: [] };

    mockDataService.getBook.and.returnValue(of(book));

    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        RouterTestingModule
      ],
      declarations: [ BookReviewComponent ],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: ActivatedRoute, useValue: {
          params: of({ reviewId: '1' }),
          snapshot: { parent: {
              params: { id: '1' }}}
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set empty review', () => {
    expect(component.review).toBeFalsy();
  });
});
