import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { IBook } from '../../models/book.models';
import { DataService } from '../../services/data.service';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { BooksUIActions } from '../actions';

@Component({
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit, OnDestroy {

  bookId: number;
  book$: Observable<IBook>;
  sub: Subscription;

  constructor(private store: Store<fromRoot.State>,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _snackBar: MatSnackBar) {
    this.book$ = this.store.pipe(select(fromRoot.selectActiveBook));
  }

  ngOnInit() {
    if (!this.bookId) {
      this.sub = this._route.params.subscribe(
        params => {
          const id = +params['id'];
          this.getBook(id);
        });
    } else {
      this.getBook(this.bookId);
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getBook(id: number): void {
    this.store.dispatch(BooksUIActions.getBook({ bookId: id }));
  }

  onRatingUpdate(book: IBook, rating: number): void {
    this.updateBook(book, { ...book, rating: rating });
  }

  updateMessage(message: string, type: string, actionText: string = 'DISMISS') {
    if (message) {
      this._snackBar.open(`${type}: ${message}`, actionText, {
        duration: 3000
      });
    }
  }

  return(): void {
    this._router.navigate(['/collection']);
  }

  updateBook(oldBook: IBook, newBook: IBook): void {
    this.store.dispatch(BooksUIActions.updateBook({ book: oldBook, changes: newBook }));
  }

  previous(book: IBook): void {
    this._dataService
      .getPreviousBookId(book.id)
      .subscribe((bookId) => this._router.navigate(['/collection', bookId]));
  }

  next(book: IBook): void {
    this._dataService
      .getNextBookId(book.id)
      .subscribe((bookId) => this._router.navigate(['/collection', bookId]));
  }
}
