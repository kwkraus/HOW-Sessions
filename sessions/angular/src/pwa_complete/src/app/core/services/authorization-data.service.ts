import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { ActionCode } from '../models/authorization.types';

@Injectable({ providedIn: 'root' })
export class AuthorizationDataService {

    private metadataUrl = AppConfig.settings ? AppConfig.settings.apiServer.metadata : null;

    constructor(private http: HttpClient) { }

    private handleError(error: any) {
      const errMsg = (error.message) ? error.message : error.status ?
        `${error.status} - ${error.statusText}` : 'Server error';
      return throwError(errMsg);
    }

    getPermissions() {
        return this.http.get<Array<ActionCode>>(`${this.metadataUrl}authorizations`)
        .pipe(
          catchError(this.handleError)
        );
    }
}
