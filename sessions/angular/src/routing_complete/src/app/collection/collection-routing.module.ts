import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionComponent } from './book-collection/collection.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookGuardService } from '../guards/book-guard.service';
import { CollectionResolver } from './collection.resolver';
import { BookReviewComponent } from './book-review/book-review.component';

const routes: Routes = [
  {
    path: '',
    component: CollectionComponent,
    resolve: { books: CollectionResolver }
  },
  {
    path: ':id',
    canActivate: [BookGuardService],
    component: BookDetailComponent,
    children: [
      {
        path: 'reviews/:reviewId',
        component: BookReviewComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }
