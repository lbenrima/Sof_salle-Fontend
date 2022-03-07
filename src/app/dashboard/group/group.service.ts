/**
 * Created by m.drissi on 19/07/2017.
 */

import {Injectable} from "@angular/core";
import { Http,Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import {Group} from './group.model';
import {GroupCollab} from './groupCollab';
import {Member} from './member.model';
import {Collab} from '../user/collab'
import {Observable}   from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Configuration} from "../../app.constants";

@Injectable()
export class GroupService {

    constructor (private http: Http,private config:Configuration) {}

    sendGroup(groupCollab:GroupCollab) {
        let url = this.config.ServerWithApiUrl+"/group/create";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(groupCollab);
        console.log(msg);
        console.log(url);

        return this.http.post(url, JSON.stringify(groupCollab), {headers: headers1});
    }

    getListGroup() {
        let url = this.config.ServerWithApiUrl+"/group/all/";
        return this.http.get(url+window.localStorage.getItem("currentUserName"));
    }

    deleteGroup (id: number) {

        let url = this.config.ServerWithApiUrl+"/group/delete/"  ;
        let headers1 = new Headers({'Content-Type': 'application/json', 'Authorization': 'No Auth '});
        let options = new RequestOptions({
            headers: headers1,
            });

        console.log(id);

        return this.http.delete(url + id.toString(),options)
            .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
}
