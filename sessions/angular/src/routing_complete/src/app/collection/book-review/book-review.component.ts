import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { IBookReview } from '../../models/book.models';

@Component({
  selector: 'app-book-review',
  templateUrl: './book-review.component.html',
  styleUrls: ['./book-review.component.css']
})
export class BookReviewComponent implements OnInit, OnDestroy {

  sub: Subscription;
  review: IBookReview;

  constructor(private route: ActivatedRoute,
    private dataService: DataService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        const bookId = +this.route.snapshot.parent.params['id'];
        const reviewId = +params['reviewId'];
        this.dataService.getBook(bookId).subscribe(
          book => this.review = book.bookReviews!.find(review => review.id === reviewId));
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

