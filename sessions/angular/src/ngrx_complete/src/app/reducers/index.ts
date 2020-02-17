import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as fromBooks from './books.reducer';

export interface State {
  books: fromBooks.State;
}

export const reducers: ActionReducerMap<State> = {
  books: fromBooks.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

// Selectors
export const selectBooksState = createFeatureSelector<fromBooks.State>('books');

export const selectAllBooks = createSelector(
  selectBooksState,
  fromBooks.selectAll
);

export const selectActiveBook = createSelector(
  selectBooksState,
  fromBooks.selectActiveBook
);
