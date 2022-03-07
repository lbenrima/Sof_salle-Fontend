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
export class ReservationService {

    constructor (private http: Http,private config:Configuration) {}

    sendSimpleReservation(reservation:Reservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/create";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(reservation);
        console.log(msg);
        console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }

    sendCheckRequest(reservation:Reservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/check";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(reservation);
        console.log(msg);
        console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }

    sendDailyReservation(reservation:Reservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/createDailyReservation";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(reservation);
        console.log(msg);
        console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }

    sendMonthlyReservation(reservation:Reservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/createMonthlyReservation";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(reservation);
        console.log(msg);
        console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }

    getListReservation() {
        let url = this.config.ServerWithApiUrl+"/reservation/all";
        return this.http.get(url);
    }

    getListRoom() {
            let url = this.config.ServerWithApiUrl+"/room/allrooms";
            return this.http.get(url);
    }

    deleteReservation (id: number): Observable <Reservation[]> {

        console.log(id);
        
        let url = this.config.ServerWithApiUrl+"/reservation/delete/"  ;
        let headers1 = new Headers({'Content-Type': 'application/json', 'Authorization': 'No Auth '});
        let options = new RequestOptions({
            headers: headers1,
        });

        return this.http.delete(url + id.toString(),options)
            .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

    getListCollabs () {
        let url = this.config.ServerWithApiUrl+"/liste-collabs/all";
        return this.http.get(url);
    }
}
