import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { IBook } from '../../models/book.models';
import { DataService } from '../../services/data.service';
import { BookDetailComponent } from '../book-detail/book-detail.component';
import { NewBookComponent } from '../new-book/new-book.component';

@Component({
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  pageTitle: string;
  books: Array<IBook>;

  showOperatingHours: boolean;
  openingTime: Date;
  closingTime: Date;
  searchTerm$ = new Subject<string>();

  constructor(private _snackBar: MatSnackBar,
    private _dataService: DataService,
    private _dialog: MatDialog,
    private _router: Router,
    private _route: ActivatedRoute) {
    this.openingTime = new Date();
    this.openingTime.setHours(10, 0);
    this.closingTime = new Date();
    this.closingTime.setHours(15, 0);
  }

  ngOnInit() {
    // const testObject = {
    //   name: 'Fred'
    // };
    // const test = (<any>testObject).address.city;
    this.books = this._route.snapshot.data['books'];
    this._dataService.search(this.searchTerm$)
      .subscribe(books => {
        this.books = books;
      });
  }

  updateMessage(message: string, type: string): void {
    if (message) {
      this._snackBar.open(`${type}: ${message}`, 'DISMISS', {
        duration: 3000
      });
    }
  }


  onRatingUpdate(book: IBook): void {
    this.updateBook(book);
    this.updateMessage(book.title, ' Rating has been updated');
  }

  updateBook(book: IBook): void {
    this._dataService.updateBook(book)
      .subscribe(
        () => {
          this._snackBar.open(`"${book.title}" has been updated!`, 'DISMISS', {
            duration: 3000
          });
        }, error => this.updateMessage(<any>error, 'ERROR'));
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
    this._dataService
      .deleteBook(book.id)
      .subscribe(() => {
        this.getBooks();
        this._snackBar.open(`"${book.title}" has been deleted!`,
          'DISMISS', {
            duration: 3000
          });
      }, error => this.updateMessage(<any>error, 'ERROR'));
  }

  getBooks(): void {
    this._dataService.getBooks().subscribe(
      books => this.books = books,
      error => this.updateMessage(<any>error, 'ERROR'));
  }

  addBook(): void {
    const config = {
      width: '650px', height: '650px', position: { top: '50px' },
      disableClose: true
    };
    const dialogRef = this._dialog.open(NewBookComponent, config);
    dialogRef.afterClosed().subscribe(newBook => {
      if (newBook) {
        this._dataService.addBook(newBook)
          .subscribe(() => {
              this.getBooks();
              this._snackBar.open(`Book added!`,
                'DISMISS', {
                  duration: 3000
              });
            },
            error => this.updateMessage(<any>error, 'ERROR'));
      }
    });
  }

}
