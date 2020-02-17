import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './models/app-config.models';
import { environment } from '../environments/environment';
import { IAppMonitor } from './models/app-monitor';

@Injectable({ providedIn: 'root'})
export class AppConfig {

    static settings: IAppConfig;
    static appMonitor: IAppMonitor;

    constructor(private http: HttpClient) {
    }

    load() {
        const jsonFile = `assets/config/config.${environment.name}.json`;
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
