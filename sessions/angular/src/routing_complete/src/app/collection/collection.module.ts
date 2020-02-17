import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule, MatTabsModule, MatSnackBarModule,
  MatDialogModule, MatCardModule, MatIconModule,
  MatSlideToggleModule, MatButtonModule, MatLineModule,
  MatInputModule, MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionComponent } from './book-collection/collection.component';
import { RatingCategoryPipe } from '../pipes/rating-category.pipe';
import { RatingComponent } from '../rating/rating.component';
import { NewBookComponent } from './new-book/new-book.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookReviewComponent } from './book-review/book-review.component';

@NgModule({
  imports: [
    CommonModule,
    CollectionRoutingModule,
    FormsModule,
    HttpClientModule,
    MatListModule,
    MatTabsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatLineModule,
    MatInputModule,
    MatToolbarModule
  ],
  entryComponents: [
      NewBookComponent
  ],
  declarations: [
    CollectionComponent,
    RatingComponent,
    BookDetailComponent,
    NewBookComponent,
    RatingCategoryPipe,
    BookReviewComponent
  ]
})
export class CollectionModule { }
