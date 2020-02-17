import { createAction, props } from '@ngrx/store';
import { IBook } from '../../models/book.models';

export const booksLoaded = createAction(
  '[Books API] Books Loaded Success', props<{ books: Array<IBook> }>()
);

export const bookLoaded = createAction(
    '[Books API] Book Loaded Success', props<{ book: IBook }>()
);

export const bookCreated = createAction(
  '[Books API] Book Created', props<{ book: IBook }>()
);

export const bookUpdated = createAction(
  '[Books API] Book Updated', props<{ book: IBook }>()
);

export const bookDeleted = createAction(
  '[Books API] Book Deleted', props<{ book: IBook }>()
);

export const bookDeleteFailed = createAction(
    '[Books API] Book Delete Failed', props<{ book: IBook }>()
);

export type BooksApiActions = ReturnType<
    typeof booksLoaded | typeof bookLoaded | typeof bookCreated | typeof bookUpdated | typeof bookDeleted>;
