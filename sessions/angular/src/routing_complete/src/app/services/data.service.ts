import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IBook } from '../models/book.models';
import { AppConfig } from '../app.config';

@Injectable({ providedIn: 'root' })
export class DataService {

  _booksUrl = AppConfig.settings ? `${AppConfig.settings.apiServer.books}books` : null;

  constructor(private _http: HttpClient) { }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message : error.status ?
      `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return observableThrowError(errMsg);
  }

  search(terms: Observable<string>) {
    return terms
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => this.getBooks(term))
      );
  }

  getBooks(query?: string): Observable<IBook[]> {
    return this._http.get<IBook[]>(this._booksUrl)
      .pipe(
        map((books: IBook[]) => {
          if (query != null && query.length > 0) {
            books = books.filter(
              data =>
                data.author.includes(query) ||
                data.title.includes(query)
            );
          }
          return books;
        }),
        catchError(this.handleError)
      );
  }

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

  getPreviousBookId(id: number): Observable<number> {
    return this.getBooks()
      .pipe(
        map((books: IBook[]) => {
          return books[Math.max(0, books.findIndex(b => b.id === id) - 1)].id;
        }),
        catchError(this.handleError)
      );
  }

  getNextBookId(id: number): Observable<number> {
    return this.getBooks()
      .pipe(
        map((books: IBook[]) => {
          return books[Math.min(books.length - 1, books.findIndex(b => b.id === id) + 1)].id;
        }),
        catchError(this.handleError)
      );
  }

  updateBook(book: IBook): Observable<IBook> {
    return this._http.put<IBook>(this._booksUrl, book)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteBook(id: number): Observable<{}> {
    return this._http.delete(`${this._booksUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  addBook(book: IBook): Observable<IBook> {
    return this._http.post<IBook>(this._booksUrl, book)
      .pipe(
        catchError(this.handleError)
      );
  }

  canActivate(id): Observable<boolean> {
    return this._http.get<boolean>(`${this._booksUrl + '/canactivate'}/${id}`)
      .pipe(catchError(this.handleError));
  }
}
