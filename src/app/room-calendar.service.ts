import { Injectable } from '@angular/core';
import { User } from './dashboard/user/user';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import { Room } from './dashboard/room/models/room';
const headers1 = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'No Auth ' });

@Injectable()
export class RoomCalendarService {
 constructor() { this.reloadData = new Subject<Room[]>();}
private reloadData: Subject<Room[]>;

      toggleIdentifier(rooms: Room[]) {
        this.reloadData.next(rooms);
    }
    onToggleIdentifier(): Observable<Room[]> {
        return this.reloadData;
    }
}
