import { Injectable } from "@angular/core";
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from "@angular/router";

import { Configuration } from "../app.constants";

@Injectable()
export class LoginService {
    token: string;
    private User = {
        profile: 2,
        name: ""
    }
    constructor(private http: Http, private router: Router, private config: Configuration) { }

    sendCredential(model) {
        let tokenUrl1 = this.config.ServerWithApiUrl + "/auth/login";
        let headers1 = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(tokenUrl1, JSON.stringify(model), { headers: headers1 });
    }

    sendToken(token ,username) {
        let tokenUrl2 = this.config.ServerWithApiUrl + "/auth/users";
        let getHeaders = new Headers({ 'Authorization': 'Bearer ' + token,'email':username});
        return this.http.get(tokenUrl2, { headers: getHeaders })
    }

    logout() {
        localStorage.setItem("token", "");
        localStorage.setItem("currentUserName", '');
        sessionStorage.setItem("nameUser", '');
        // alert("You just logged out.");
        this.router.navigate(['/login']);

    }
    _getUser() {
        let user = JSON.parse(localStorage.getItem("User"));
        if (user === undefined || user == null) {
            this.router.navigate(['/login']);
        }
		else
			return user[0];
    }
    checkLogin() {
        if (localStorage.getItem("currentUserName") != null && localStorage.getItem("currentUserName") != '' && localStorage.getItem("token") != null && localStorage.getItem("token") != '') {
            return true;
        } else {
            return false;
        }
    }

}
