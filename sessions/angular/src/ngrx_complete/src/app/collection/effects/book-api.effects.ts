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
