import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { IBook } from '../../models/book.models';
import { DataService } from '../../services/data.service';
import { BookDetailComponent } from '../book-detail/book-detail.component';
import { NewBookComponent } from '../new-book/new-book.component';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { BooksUIActions } from '../actions';

@Component({
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  pageTitle: string;
  showOperatingHours: boolean;
  openingTime: Date;
  closingTime: Date;
  searchTerm$ = new Subject<string>();
  books$: Observable<Array<IBook>>;

  constructor(private store: Store<fromRoot.State>,
    private _snackBar: MatSnackBar,
    private _dataService: DataService,
    private _dialog: MatDialog,
    private _router: Router,
    private _route: ActivatedRoute) {
    this.openingTime = new Date();
    this.openingTime.setHours(10, 0);
    this.closingTime = new Date();
    this.closingTime.setHours(15, 0);
    this.books$ = this.store.pipe(select(fromRoot.selectAllBooks));
  }

  ngOnInit() {
    this.getBooks();
    // this._dataService.search(this.searchTerm$)
    //   .subscribe(books => {
    //     this.books = books;
    //   });
  }

  onRatingUpdate(book: IBook, rating: number): void {
    this.updateBook(book, { ...book, rating: rating });
  }

  updateBook(oldBook: IBook, newBook: IBook): void {
    this.store.dispatch(BooksUIActions.updateBook({ book: oldBook, changes: newBook }));
  }

  openDialog(bookId: number): void {
    const config = { width: '650px', height: '400x', position: { top: '50px' } };
    const dialogRef = this._dialog.open(BookDetailComponent, config);
    dialogRef.componentInstance.bookId = bookId;
    dialogRef.afterClosed().subscribe(res => {
      this.getBooks();
    });
  }

  openRoute(bookId: number): void {
    this._router.navigate(['/collection', bookId]);
  }

  delete(book: IBook) {
    this.store.dispatch(BooksUIActions.deleteBook({ book: book }));
  }

  getBooks(): void {
    this.store.dispatch(BooksUIActions.init());
  }

  addBook(): void {
    const config = {
      width: '650px', height: '650px', position: { top: '50px' },
      disableClose: true
    };
    const dialogRef = this._dialog.open(NewBookComponent, config);
    dialogRef.afterClosed().subscribe(newBook => {
      if (newBook) {
        this.store.dispatch(BooksUIActions.createBook({ book: newBook }));
      }
    });
  }

}
