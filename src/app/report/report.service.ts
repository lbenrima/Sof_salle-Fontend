import { Injectable } from "@angular/core";
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from "@angular/router";

import { Configuration } from "../app.constants";

@Injectable()
export class ReportService {
    token: string;
    private User = {
        profile: 2,
        name: ""
    }
    constructor(private http: Http, private router: Router, private config: Configuration) { }

    sendMail(model) {
        let tokenUrl1 = this.config.ServerWithApiUrl + "/report/sendMail";
        let headers1 = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(tokenUrl1, JSON.stringify(model), { headers: headers1 });
    }


}
