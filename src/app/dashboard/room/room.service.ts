/**
 * Created by m.drissi on 10/08/2017.
 */

import {Injectable} from "@angular/core";
import { Http,Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import {Observable}   from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Room} from './models/room'

import {Configuration} from "../../app.constants";

@Injectable()
export class RoomService {

    constructor (private http: Http,private config:Configuration) {}

    getRooms() {
        let url = this.config.ServerWithApiUrl+"/room/allrooms";
        return this.http.get(url);
    }

    getBuildings(){
        let url = this.config.ServerWithApiUrl+"/room/buildings";
        return this.http.get(url);
    }

    getFloors(){
        let url = this.config.ServerWithApiUrl+"/room/floors";
        return this.http.get(url);
    }

    getBlocks(){
        let url = this.config.ServerWithApiUrl+"/room/blocks";
        return this.http.get(url);
    }

    sendNewRoom(room:Room) {
        let url = this.config.ServerWithApiUrl+"/room/create";
        let headers1 = new Headers({'Content-Type': 'application/json',  'Authorization':'No Auth '});
        let msg = JSON.stringify(room);
        console.log(msg);
        console.log(url);
        return this.http.post(url, JSON.stringify(room), {headers: headers1});
    }

    deleteRoom(id:number){
        console.log(id);

        let url = this.config.ServerWithApiUrl+"/room/delete/"  ;
        let headers1 = new Headers({'Content-Type': 'application/json', 'Authorization': 'No Auth '});
        let options = new RequestOptions({
            headers: headers1,
        });

        return this.http.delete(url + id.toString(),options)
            .map((res:Response) => res.json())
            //.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

    updateRoom (id:number,newRoom: Room) {
        let url = this.config.ServerWithApiUrl+"/room/update/"  ;
        let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options       = new RequestOptions({ headers: headers }); // Create a request option

        return this.http.put(url+ id.toString(), newRoom, options) // ...using put request
            .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
           // .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

}

