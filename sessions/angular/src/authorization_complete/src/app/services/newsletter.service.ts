import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class NewsletterService {

    constructor(private http: HttpClient) {
    }

    addPushSubscriber(sub: any) {
        return this.http.post(environment._pushServerUrl + '/api/notifications', sub);
    }

    send() {
        return this.http.post(environment._pushServerUrl + '/api/newsletter', null);
    }

}
