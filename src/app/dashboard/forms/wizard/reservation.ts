import {User} from "../../user/user";
import {TypeReservation} from "./typereservation";
import {VisibilityType} from  "./visibilitytype";
import {ImportanceLevel} from "./importancelevel"
import {Room} from "../../room/models/room"


import DateTimeFormat = Intl.DateTimeFormat;


/**
 * Created by m.drissi on 14/07/2017.
 */

export class Reservation {
    idreservation: number;
    title: string;
    description: string;
    color:string;
    typeres: TypeReservation;
    visibilitytyperes : VisibilityType;
    reservedby : User;
    room : Room;
    simple:boolean;
    daily : boolean;
    weekly : boolean;
    monthly : boolean;
    yearly : boolean;
    startdate: Date;
    starttime : Date;
    enddate:Date;
    endtime : Date;
    allday : boolean;
    frequency : number;
    reccurenceNumber : number ;
    stateres : boolean;
    dayofweek : boolean;
    dayofmonth : boolean;
    equipments : boolean;
    descp : string;
    selectedType : string;
    selectedIml : string;

}
