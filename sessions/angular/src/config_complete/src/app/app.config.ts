import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './models/app-config.models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root'})
export class AppConfig {

    static settings: IAppConfig;

    constructor(private http: HttpClient) {
    }

    load() {
        const cacheBusterParam = (new Date()).getTime();
        const jsonFile = `assets/config/config.${environment.name}.json?nocache=${cacheBusterParam}`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise()
                .then((response: IAppConfig) => {
                    AppConfig.settings = <IAppConfig>response;
                    resolve();
                }).catch((response: any) => {
                    reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
                });
        });
    }
}
