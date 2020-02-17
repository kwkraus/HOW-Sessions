import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IBook } from '../models/book.models';

@Component({
  selector: 'my-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  @Input() rating: number;
  @Output() ratingClicked: EventEmitter<number> = new EventEmitter<number>();

  click(rating: number): void {
    this.rating = rating;
    this.ratingClicked.emit(rating);
  }
}
