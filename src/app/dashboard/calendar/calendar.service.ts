/**
 * Created by m.drissi on 09/08/2017.
 */


/**
 * Created by m.drissi on 23/07/2017.
 */
import {Injectable} from "@angular/core";
import { Http,Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import {Observable}   from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import { Room } from '../room/models/room';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Configuration} from "../../app.constants";

@Injectable()
export class CalendarService {

    constructor (private http: Http,private config:Configuration) {
         this.reloadData = new Subject<Room[]>();}
private reloadData: Subject<Room[]>;

    deleteEv (id: number) {

        console.log(id);

        let url = this.config.ServerWithApiUrl+"/reservation/delete/"  ;
        let headers1 = new Headers({'Content-Type': 'application/json', 'Authorization': 'No Auth '});
        let options = new RequestOptions({
            headers: headers1,
        });

        return this.http.delete(url + id.toString(),options)
            .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
            //.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    deleteOccurence (id: number) {

        console.log(id);

        let url = this.config.ServerWithApiUrl+"/reservation/deleteOccurance?id="  ;
        let headers1 = new Headers({'Content-Type': 'application/json', 'Authorization': 'No Auth '});
        let options = new RequestOptions({
            headers: headers1,
        });

        return this.http.delete(url + id.toString(),options)
            .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
            //.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
	getListEvents() {
        let url = this.config.ServerWithApiUrl+"/reservation/allEvents";
        return this.http.get(url);
    }

 getFavoriteCalendars() {
             let headers1 = new Headers({'Content-Type': 'application/json', 'Authorization': 'No Auth '});
        let url = this.config.ServerWithApiUrl + "/prefCalendar?mail=" + localStorage.getItem("currentUserName");
        return this.http.get(url, { headers: headers1 });

    }
    toggleIdentifier(rooms: Room[]) {
        this.reloadData.next(rooms);
    }
    onToggleIdentifier(): Observable<Room[]> {
        return this.reloadData;
    }
}
