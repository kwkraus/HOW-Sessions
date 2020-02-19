import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Injectable({ providedIn: 'root' })
export class BookGuardService {

  constructor(private router: Router, private dataService: DataService) { }

  canActivate(route: ActivatedRouteSnapshot) {
   // get the book id from the route.
   // Note:+ ensures that the value is returned as number and not string
    const id = +route.params['id'];
    if (isNaN(id)) {
      // optionally, redirect to an appropriate
      this.router.navigate(['/collection']);
      return false;
    }

    return this.dataService.canActivate(id).pipe(
        map(result => {
          if (result) {
              return true;
          }
          this.router.navigate(['/collection']);
          return of(false);
        }),
        catchError(() => {
          this.router.navigate(['/collection']);
          return of(false);
        })
    );
  }
}
