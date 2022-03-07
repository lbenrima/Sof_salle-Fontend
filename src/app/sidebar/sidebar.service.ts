import { Injectable } from '@angular/core';
import {Configuration} from "../app.constants";
import { User } from '../dashboard/user/user';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
const headers1 = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'No Auth ' });
@Injectable()
export class SidebarService {
    
    constructor(private http: Http, private config: Configuration) { }

    addFavoriteCalendar(user: User) {
        let url = this.config.ServerWithApiUrl + "/prefCalendar";
        return this.http.post(url, JSON.stringify(user), { headers: headers1 });

    }
    getFavoriteCalendars() {
        let url = this.config.ServerWithApiUrl + "/prefCalendar?mail=" + localStorage.getItem("currentUserName");
        return this.http.get(url, { headers: headers1 });

    }
}
