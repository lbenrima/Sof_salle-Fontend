/**
 * Created by m.drissi on 23/07/2017.
 */
import {Injectable} from "@angular/core";
import { Http,Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import {Reservation} from '../models/reservation';
import {Observable}   from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {WeeklyRes} from "../models/weeklyRes";
import {NewReservation} from "../models/newReservation";

import {Configuration} from "../../../app.constants";

@Injectable()
export class ReservationService {

    constructor (private http: Http,private config:Configuration) {}

    sendSimpleReservation(reservation:NewReservation) {
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
        // console.log(msg);
        // console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }
    listofroomnotconflit(reservation:Reservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/listofroomnotconflit";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(reservation);
        // console.log(msg);
        // console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }

    sendCheckRequests(reservation:Reservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/checks";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(reservation);
        console.log(msg);
        console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }

    sendDailyReservation(reservation:NewReservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/createDailyReservation";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(reservation);
        console.log(msg);
        console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }

    sendWeeklyReservation(reservation:NewReservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/createWeeklyReservation";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(reservation);
        console.log(msg);
        console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }

    sendMonthlyReservation(reservation:NewReservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/createMonthlyReservation";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(reservation);
        console.log(msg);
        console.log(url);
        return this.http.post(url, JSON.stringify(reservation), {headers: headers1});
    }

    sendYearlyReservation(reservation:NewReservation) {
        let url = this.config.ServerWithApiUrl+"/reservation/createYearlyReservation";
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

    getListDays() {
        let url = this.config.ServerWithApiUrl+"/reservation/days";
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

    getReservation(id : number){
        let url = this.config.ServerWithApiUrl+"/reservation/res/"  ;
        let headers1 = new Headers({'Content-Type': 'application/json', 'Authorization': 'No Auth '});
        let options = new RequestOptions({
            headers: headers1,
        });

        return this.http.get(url + id.toString(),options)
            .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
}
