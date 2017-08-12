import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { ConfigService } from '../ConfigService';

@Injectable()
export class SecureFileService {

    private actionUrl: string;
    private fileExplorerUrl: string;
    private headers: Headers;

    constructor(private _http: Http, private config: ConfigService, private oidcSecurityService: OidcSecurityService) {
        this.actionUrl = `${config.apiFileServer}api/Download/`;
        this.fileExplorerUrl = `${config.apiFileServer }api/FileExplorer/`;
    }

    public DownloadFile(id: string) {
        this.setHeaders();
        let oneTimeAccessToken = '';
        this._http.get(`${this.actionUrl}GenerateOneTimeAccessToken/${id}`, {
            headers: this.headers,
            body: ''
        }).map(
            res => res.text()
            ).subscribe(
            data => {
                oneTimeAccessToken = data;
            },
            error => this.oidcSecurityService.handleError(error),
            () => {
                console.log(`open DownloadFile for file ${id}: ${this.actionUrl}${oneTimeAccessToken}`);
                window.open(`${this.actionUrl}${oneTimeAccessToken}`);
            });
    }

    public GetListOfFiles = (): Observable<string[]> => {
        this.setHeaders();
        return this._http.get(this.fileExplorerUrl, {
            headers: this.headers,
            body: ''
        }).map(res => res.json());
    }

    private setHeaders() {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        let token = this.oidcSecurityService.getToken();

        if (token !== '') {
            this.headers.append('Authorization', 'Bearer ' + token);
        }
    }
}