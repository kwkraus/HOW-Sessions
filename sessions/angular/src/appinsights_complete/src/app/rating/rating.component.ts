import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IBook } from '../models/book.models';

@Component({
  selector: 'my-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  @Input() rating: number;
  @Input() book: IBook;
  @Output() ratingClicked: EventEmitter<IBook> = new EventEmitter<IBook>();

  click(rating: number): void {
    this.book.rating = rating;
    this.ratingClicked.emit(this.book);
  }
}
