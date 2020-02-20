import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IBingSearchResult, IBingMediaSearch } from '../models/bing-search.models';

@Injectable({ providedIn: 'root' })
export class BingSearchService {

    constructor(private http: HttpClient) { }

    private handleError(error: any) {
      const errMsg = (error.message) ? error.message : error.status ?
        `${error.status} - ${error.statusText}` : 'Server error';
      return throwError(errMsg);
    }

    getImages(keyword: string, subscriptionKey: string) {
        const url = `https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${keyword}&count=10&safeSearch=Strict`;

        const options = {
            headers: new HttpHeaders({ 'Ocp-Apim-Subscription-Key': subscriptionKey })
        };
        return this.http.get<IBingSearchResult>(url, options)
            .pipe(map((searchResult) => {
                return this.getFormattedResults(searchResult);
            }),
                catchError(this.handleError)
            );
    }

    private getFormattedResults(searchResult: IBingSearchResult) {
        return (searchResult.value as IBingMediaSearch[]).map(result => {
            return {
                contentUrl: result.contentUrl,
                thumbnailUrl: result.thumbnailUrl,
                name: result.name
            };
        });
    }
}
