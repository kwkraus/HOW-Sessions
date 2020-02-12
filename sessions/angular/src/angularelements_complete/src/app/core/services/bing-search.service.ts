import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { ActionCode } from '../models/authorization.types';
import { IBingSearchResult, IBingMediaSearch } from '../models/bing-search.models';

@Injectable({ providedIn: 'root' })
export class BingSearchService {

    constructor(private http: HttpClient) { }

    private handleError(error: any) {
      const errMsg = (error.message) ? error.message : error.status ?
        `${error.status} - ${error.statusText}` : 'Server error';
      return throwError(errMsg);
    }

    getImage(keyword: string, subscriptionKey: string) {
        // this.cognitiveApiService.subscriptionKeys.bingSearch
        const url = `https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=${keyword}&count=10&safeSearch=Strict`;
        const headers = new HttpHeaders({
            'Ocp-Apim-Subscription-Key': subscriptionKey
        });
        const options = { headers: headers };
        return this.http.get<IBingSearchResult>(url, options)
            .pipe(map((searchResult) => {
                return this.getFormattedResults(searchResult);
            }),
                catchError(this.handleError)
            );
    }

    private getFormattedResults(searchResult: IBingSearchResult) {
        return (<IBingMediaSearch[]>searchResult.value).map(result => {
            return {
                webSearchUrl: result.webSearchUrl,
                thumbnailUrl: result.thumbnailUrl
            };
        });
    }
}
