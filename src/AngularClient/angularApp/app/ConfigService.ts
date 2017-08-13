import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigService {
    private config: any;

    get apiServer() {
        return this.getProperty('apiServer');
    }

    get apiFileServer() {
        return this.getProperty('apiFileServer');
    }

    constructor(private http: Http) {
    }

    //load(): Promise<any> {
    //    console.log('get user called');
    //    const promise = this.http.get(window.location.origin + window.location.pathname + '/api/ClientAppSettings').map((res) => res.json()).toPromise();
    //    promise.then(config => {
    //        this.config = config;     // <--- THIS RESOLVES AFTER
    //        console.log(this.config);
    //    });
    //    return promise;
    //}
    load() {
        this.loadConfigClient().subscribe(config => {
            this.config = config;
        });
    }
    loadConfigClient() {

        // console.log('window.location', window.location);
        // console.log('window.location.href', window.location.href);
        // console.log('window.location.origin', window.location.origin);

        return this.http.get(window.location.origin + window.location.pathname + '/api/ClientAppSettings').map(res => {
            this.config = res.json();
        });
    }

    private getProperty(property: string): any {
        //noinspection TsLint
        if (!this.config) {
            throw new Error(`Attempted to access configuration property before configuration data was loaded, please double check that 'APP_INITIALIZER is properly implemented.`);
        }

        if (!this.config[property]) {
            throw new Error(`Required property ${property} was not defined within the configuration object. Please double check the assets/config.json file`);
        }

        return this.config[property];
    }
}