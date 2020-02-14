import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Injectable()
export class BookGuardService {

  constructor(private _router: Router, private _dataService: DataService) { }

  canActivate(route: ActivatedRouteSnapshot) {
   // parse the book id from the route.
   // Note:+ ensures that the value is returned as number and not string
    const id = +route.url[0].path;
    if (isNaN(id)) {
      // start a new navigation to redirect to list page
      this._router.navigate(['/collection']);
      // abort current navigation
      return false;
    }

    return this._dataService.canActivate(id).pipe(
        map(result => {
          if (result) {
              return true;
          }
          this._router.navigate(['/collection']);
          return of(false);
        }),
        catchError(() => {
          this._router.navigate(['/collection']);
          return of(false);
        })
    );
  }
}
