import { User } from "../../user/user";
import { TypeReservation } from "./typereservation";
import { VisibilityType } from "./visibilitytype";
import DateTimeFormat = Intl.DateTimeFormat;
import { Room } from "../../room/models/room";
import {Day} from './day';
/**
 * Created by m.drissi on 14/07/2017.
 */

export class Reservation {
    idreservation: number;
    title: string;
    description: string;
    color: string = "#000000";
    typeres: TypeReservation;
    visibilitytyperes: VisibilityType;
    reservedby: User;
    room: Room;
	daysList: Day[];			 
    simple: boolean;
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
    yearly: boolean;
	acceptConflict: boolean;					 
    startdate: String;
    starttime: String;
    enddate: String;
    endtime: String;
    allday: boolean;
    frequency: number;
    reccurenceNumber: number;
    reccurenceenddate: string;
    dailyenddate: string
    stateres: boolean;
    dayofweek: boolean;
    dayofmonth: boolean;
    monthdayof: string;
    descp: string;
    typereservation:string;
    lasttypereservation:string;
    jourEntiere:boolean=false;
    invitePartisipans:boolean=false;
    invited:string;
    constructor() {
        this.title = "";
        this.frequency = 1;
        this.idreservation = undefined;
        this.color = "#FF0000";
        this.typeres = new TypeReservation();
        this.visibilitytyperes = new VisibilityType();
        this.reservedby = new User();
        this.room = new Room();
        this.dailyenddate = "radioocur";
        this.reccurenceNumber = 1;
        this.monthdayof = "dayofweek";
		this.daysList = [];
		this.simple = false;
		this.daily = false;
		this.weekly = false ;
		this.monthly = false;
		this.yearly = false;		
		this.acceptConflict = false;			 
    }

}
