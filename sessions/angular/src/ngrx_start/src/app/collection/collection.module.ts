import { NgModule } from '@angular/core';
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
import { BookGuardService } from '../guards/book-guard.service';
import { CollectionResolver } from './collection.resolver';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
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
    RatingCategoryPipe
  ],
  providers: [
      BookGuardService,
      CollectionResolver
  ]
})
export class CollectionModule { }
