/**
 * Created by m.drissi on 24/07/2017.
 */
/**
 * Created by m.drissi on 23/07/2017.
 */
import {Injectable} from "@angular/core";
import { Http,Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import {Reservation} from './reservation';
import {Observable}   from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Configuration} from "../../../app.constants";
@Injectable()
export class CaracsService {

    constructor (private http: Http,private config:Configuration) {}

    getListVisibility() {
        let url = this.config.ServerWithApiUrl+"/caracs/vis/all";
        return this.http.get(url);
    }

    getListType() {
        let url = this.config.ServerWithApiUrl+"/caracs/type/all";
        return this.http.get(url);
    }

    getListImpl() {
        let url = this.config.ServerWithApiUrl+"/caracs/imlevel/all";
        return this.http.get(url);
    }


}
