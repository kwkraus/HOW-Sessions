import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';
import { BooksApiActions } from '../actions';

@Injectable()
export class BooksUiEffects {

    showUpdateSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(BooksApiActions.bookUpdated.type),
        map(({ book }) => this.showSnackBar(`"${book.title}" has been updated!`))
    ), { dispatch: false });
    showDeleteSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(BooksApiActions.bookDeleted.type),
        map(({ book }) => this.showSnackBar(`"${book.title}" has been deleted!`))
    ), { dispatch: false });

    private showSnackBar(message: string) {
        this.snackBar.open(message, 'DISMISS', {
            duration: 3000
        });
    }

    constructor(private actions$: Actions<BooksApiActions.BooksApiActions>,
        private snackBar: MatSnackBar) {}
}
