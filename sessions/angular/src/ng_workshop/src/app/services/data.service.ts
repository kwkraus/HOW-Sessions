import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IBook } from '../models/book.models';

@Injectable({ providedIn: 'root' })
export class DataService {

  _booksUrl = 'https://bookservicelaurie.azurewebsites.net/api/books';

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
      .pipe(
        catchError(this.handleError)
      );
    // return this.getBooks()
    //   .pipe(
    //     map((books: IBook[]) => books.find(b => b.id === id)),
    //     catchError(this.handleError)
    //   );
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
