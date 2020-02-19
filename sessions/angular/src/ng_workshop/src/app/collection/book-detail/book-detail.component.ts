import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { IBook } from '../../models/book.models';
import { DataService } from '../../services/data.service';

@Component({
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit, OnDestroy {

  bookId: number;
  book: IBook;
  sub: Subscription;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (!this.bookId) {
      this.sub = this._route.params.subscribe(
        params => {
          const id = +params['id'];
          this.getBook(id);
        });
      return;
    }
    this.getBook(this.bookId);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getBook(id: number): void {
    this._dataService.getBook(id).subscribe(
      book => this.book = book,
      error => this.updateMessage(<any>error, 'Error'));
  }

  onRatingUpdate(rating: number): void {
    this.book.rating = rating;
    this.updateBook();
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

  updateBook(): void {
    this._dataService.updateBook(this.book)
      .subscribe(books => {
          this._snackBar.open(`"${this.book.title}" has been updated!`, 'DISMISS', {
            duration: 3000
          });
        }, error => this.updateMessage(<any>error, 'ERROR'));
  }

  previous(): void {
    this._dataService
      .getPreviousBookId(this.book.id)
      .subscribe((bookId) => this._router.navigate(['/collection', bookId]));
  }

  next(): void {
    this._dataService
      .getNextBookId(this.book.id)
      .subscribe((bookId) => this._router.navigate(['/collection', bookId]));
  }
}
