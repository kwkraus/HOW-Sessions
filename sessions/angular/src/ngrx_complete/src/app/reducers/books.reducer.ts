import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector, createReducer, on, Action } from '@ngrx/store';
import { IBook } from '../models/book.models';
import { BooksUIActions, BooksApiActions } from '../collection/actions';

// export const initialBooks: Array<IBook> = [];
// https://ngrx.io/guide/entity/adapter#entity-adapter
export interface State extends EntityState<IBook> {
    // No need to declare the books array, since we get that from EntityState<IBook>
    activeBookId: number | null;
}

// Entity State uses an Adapter to manage the collection of books
export const adapter = createEntityAdapter<IBook>();

export const initialState = adapter.getInitialState({
  activeBookId: null
});

// NOTE: If we had a non-collection state, we could skip Entities and Adapter.
// Instead the reducer would look like this:
// export const initialState: State = {
//     name: '',
//     value: 0,
// };
// https://ngrx.io/guide/store/reducers#setting-the-initial-state
// https://ngrx.io/guide/store/reducers#creating-the-reducer-function

export const bookReducer = createReducer(
    initialState,
    on(BooksUIActions.init, () => {
        return initialState;
    }),
    on(BooksApiActions.booksLoaded, (state, { books }) => {
        return adapter.addAll(books, state);
    }),
    on(BooksApiActions.bookLoaded, (state, { book }) => {
        return {
            ...state,
            activeBookId: book.id
          };
    }),
    on(BooksApiActions.bookCreated, (state, { book }) => {
        return adapter.addOne(book, {
            ...state,
            activeBookId: book.id
        });
    }),
    on(BooksApiActions.bookUpdated, (state, { book }) => {
        return adapter.updateOne(
            { id: book.id, changes: book },
            { ...state, activeBookId: book.id }
        );
    }),
    on(BooksApiActions.bookDeleted, (state, { book }) => {
        return adapter.removeOne(book.id, {
            ...state,
            activeBookId: null
        });
    })
);

export function reducer(state: State | undefined, action: Action) {
    return bookReducer(state, action);
  }

// Entity Selectors
// The getSelectors method returned by the created entity adapter provides functions
//   for selecting information from the entity.
// The getSelectors method takes a selector function as its only argument to select
//   the piece of state for a defined entity.
export const { selectAll, selectEntities } = adapter.getSelectors();
export const selectActiveBookId = (state: State) => state.activeBookId;
export const selectActiveBook = createSelector(selectEntities, selectActiveBookId,
    (entities, bookId) => (bookId ? entities[bookId] : null));
