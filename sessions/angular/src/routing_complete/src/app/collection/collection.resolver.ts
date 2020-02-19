import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook } from '../models/book.models';
import { DataService } from '../services/data.service';

@Injectable({ providedIn: 'root' })
export class CollectionResolver implements Resolve<IBook[]> {
    constructor(private _dataService: DataService) {}

  /**
  * resolve() is the method we have to implement for the Resolve interface.
  * The router will call this method when the users visits the route.
  * We can return Promises, Observables or any other value here.
  * When it's a Promise or Observable, the Angular Router waits for
  * the result and then displays the page (which is what we want).
  */
  resolve(): Observable<IBook[]> {
    return this._dataService.getBooks();
  }
}
