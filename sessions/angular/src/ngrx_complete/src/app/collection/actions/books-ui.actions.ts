import { createAction, props } from '@ngrx/store';
import { IBook } from '../../models/book.models';

export const init = createAction('[Collection Page] Init');

export const getBook = createAction(
    '[Book Detail Page] Init', props<{ bookId: number }>()
);

export const createBook = createAction(
  '[Collection Page] Create Book', props<{ book: IBook }>()
);

export const updateBook = createAction(
  '[Collection Page] Update Book', props<{ book: IBook; changes: IBook }>()
);

export const deleteBook = createAction(
  '[Collection Page] Delete Book', props<{ book: IBook }>()
);

export type BooksActions = ReturnType<
    typeof init | typeof getBook | typeof createBook |
    typeof updateBook | typeof deleteBook
>;
