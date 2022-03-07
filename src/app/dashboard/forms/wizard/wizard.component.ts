import {Component, forwardRef, Inject, OnInit} from '@angular/core';
import {ReservationService} from './reservation.service';
import {CaracsService} from './caracs.service';
import {User} from "../../user/user";
import {Collab} from "../../user/collab";
import {Reservation} from "./reservation"

//import initWizard = require('../../../assets/js/init/initWizard.js');
//import initDatetimepickers = require('../../../assets/js/init/initDatetimepickers.js');
//import initDataTable = require('../../../assets/js/init/initDataTable.js');

import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import {Room} from "../../room/models/room";
import {VisibilityType} from "./visibilitytype";
import {TypeReservation} from "./typereservation";
import DateTimeFormat = Intl.DateTimeFormat;
import {AppComponent} from "../../../app.component";

declare var $:any;
declare var require:any;

const initWizard = require('../../../../assets/js/init/initWizard.js');
const initDatetimepickers = require('../../../../assets/js/init/initDatetimepickers.js');
const initDataTable = require('../../../../assets/js/init/initDataTable.js');
var endDatedaily;

@Component({
    moduleId: module.id,
    selector: 'wizard-cmp',
    providers : [ReservationService,CaracsService],
    templateUrl: 'wizard.component.html'
})

export class WizardComponent implements OnInit{
    message:string;

    id : number;
    num : number;
    newReservation : Reservation = new Reservation();
    user : User= new User();

    rooms: Room[];
    imls: any[];
    selectedRoom: Room= new Room();
    meetingRoom : Room= new Room();

    vtypes: VisibilityType[];
    selectedV: VisibilityType= new VisibilityType();
    vtype : VisibilityType= new VisibilityType();

    types: TypeReservation[];
    selectedType: TypeReservation= new TypeReservation();
    type : TypeReservation= new TypeReservation();

    collabs : Collab[];
    selectedCollab : Collab = new Collab();
    collab : Collab = new Collab();

    selectedIml : String;
    choiceenddate : number;
    numberoc : number;
    dt : Date;

    router : Router;

    constructor (private reservationService: ReservationService, private caracsService: CaracsService, private route: ActivatedRoute,@Inject(forwardRef(() => AppComponent)) private _parent: AppComponent) {
        this._parent.showSideBar = true;
        this.reservationService.getListRoom().subscribe(
            data => {  console.log(this.rooms = JSON.parse(JSON.parse(JSON.stringify(data))._body));
                       },
            error => {console.log(error)},
        );

        this.reservationService.getListCollabs().subscribe(
            data => {  console.log(this.collabs = JSON.parse(JSON.parse(JSON.stringify(data))._body));
               },
            error => {console.log(error)},
        );

        this.caracsService.getListVisibility().subscribe(
            data => {  console.log(this.vtypes = JSON.parse(JSON.parse(JSON.stringify(data))._body));},
            error => {console.log(error)},
        );

        this.caracsService.getListType().subscribe(
            data => {  console.log(this.types = JSON.parse(JSON.parse(JSON.stringify(data))._body));},
            error => {console.log(error)},
        );

        this.route.params.forEach((params: Params) => {
                this.id = Number.parseInt(params['id']);
            }
        )

    }

    onSelectionChange(vtype) {
        this.selectedV = Object.assign({}, this.selectedV, vtype);
    }

    onSelectionRoomChange(meetingRoom) {
        this.selectedRoom = Object.assign({}, this.selectedRoom, meetingRoom);
        var sdt = $('#start').data('date');
        var edt = $('#end').data('date');

        var stm = $('#starttime').data('date');
        var etm = $('#endtime').data('date');

        console.log("you chose room " + this.selectedRoom.name + "   date : " + sdt + edt + stm + etm);

        //this.newRequest.room = this.selectedRoom;
        //this.newRequest.edt = edt;
        //this.newRequest.sdt = sdt;
       // this.newRequest.stm = stm;
        //this.newRequest.etm = etm;

         this.newReservation.startdate = sdt;
         this.newReservation.starttime = stm;
         this.newReservation.enddate = edt;
         this.newReservation.endtime = etm;
         this.newReservation.room= this.selectedRoom;

         this.checkRequest(this.newReservation);

       /* this.send();
        console.log(this.newResponse.response); */

    }

    onSelectionCollabChange(collab) {
        this.selectedCollab = Object.assign({}, this.selectedCollab, collab);

    }

    onSelectChoice(choice){

        if (choice == 'textdate') {

            this.dt = endDatedaily=$('#textdate').data('date');
            this.newReservation.enddate= this.dt;
            this.numberoc= 0;
            console.log(endDatedaily.toString());
            this.choiceenddate = 3;

        }
        else if (choice == 'numberrecc'){
           // this.numberoc = $('#numberrecc');
            console.log(this.numberoc);
            this.choiceenddate = 2;
        }
        else if (choice == "noend"){
            this.numberoc = 0;
            this.choiceenddate = 1;
        }
        else if(choice == "radioocur"){
           $('#radioocur').focus();
        }
        else  if(choice == "radioend"){
           $('#radioend').focus();
        }
    }

    onSelectChoiceMonthlyEnd(choice){

        if (choice == 'textdate1') {

            this.dt = endDatedaily=$('#textdate').data('date');
            this.newReservation.enddate= this.dt;
            this.numberoc= 0;
            console.log(endDatedaily.toString());
            this.choiceenddate = 3;

        }
        else if (choice == 'numberrecc1'){
            // this.numberoc = $('#numberrecc');
            console.log(this.numberoc);
            this.choiceenddate = 2;
        }
        else if (choice == "noend1"){
            this.numberoc = 0;
            this.choiceenddate = 1;
        }
        else if(choice == "radioocur1"){
            $('#radioocur').focus();
        }
        else  if(choice == "radioend1"){
            $('#radioend').focus();
        }
    }

    onSelectChoiceDay(choice){

        if (choice == 'dayofweek') {
            this.newReservation.dayofweek=true;
            this.newReservation.dayofmonth = false;
            console.log("dayofweek chosen");

        }
        else if (choice == 'dayofmonth'){
            this.newReservation.dayofweek=false;
            this.newReservation.dayofmonth = true;
            console.log("dayofmonth chosen");
        }
    }

    onSubmitSimple(){

        var startDate;
        var endDate;
        var rec;
        var starttime;
        var endtime ;

        startDate= $('#start').data('date');
        endDate=$('#end').data('date');

        starttime= $('#starttime').data('date');
        endtime=$('#endtime').data('date');

        rec= $('#recall').data('date');

        console.log(startDate.toString());
        console.log(endDate.toString());
        console.log(rec.toString());

        console.log(starttime.toString());
        console.log(endtime.toString());

        this.num = 6;
        this.user.id=this.num ;
        this.user.stateuser= true;
        this.user.mail="maroua.drissi@sofrecom.com";
        this.user.name="maroua drissi";

        this.newReservation.reservedby= this.user;
        this.newReservation.startdate = startDate;
        this.newReservation.enddate = endDate;
        this.newReservation.starttime = starttime;
        this.newReservation.endtime = endtime;
        this.newReservation.allday = false;
        this.newReservation.simple=true;
        this.newReservation.daily=false;
        this.newReservation.weekly=false;
        this.newReservation.monthly=false;
        this.newReservation.yearly=false;
        this.newReservation.typeres=this.selectedType;
        this.newReservation.visibilitytyperes=this.selectedV;
        this.newReservation.room=this.selectedRoom;
        this.newReservation.stateres = true;

        this.reservationService.sendSimpleReservation(this.newReservation).subscribe(
            data => {
                //this.newReservation = new Reservation();
                this.message = JSON.stringify(data.text());
                console.log(this.message);
                $('#smallAlertModal').modal();
            },
            error => console.log(error)
        );
    };

    onSubmitDaily(){

        var startDatedaily;
        var recdaily;
        var starttimedaily;
        var endtimedaily ;

        startDatedaily= $('#startDatedaily').data('date');

        starttimedaily= $('#starttime').data('date');
        endtimedaily=$('#endtime').data('date');

        recdaily= $('#recdaily').data('date');

        console.log(startDatedaily.toString());
        console.log(recdaily.toString());

        console.log(starttimedaily.toString());
        console.log(endtimedaily.toString());

        this.num = 6;
        this.user.id=this.num ;
        this.user.stateuser= true;
        this.user.mail="maroua.drissi@sofrecom.com";
        this.user.name="maroua drissi";

        this.newReservation.reservedby= this.user;
        this.newReservation.startdate = startDatedaily;
        //this.newReservation.enddate = this.dt;
        this.newReservation.starttime = starttimedaily;
        this.newReservation.endtime = endtimedaily;
        this.newReservation.allday = false;
        this.newReservation.simple=false;
        this.newReservation.daily=true;
        this.newReservation.weekly=false;
        this.newReservation.monthly=false;
        this.newReservation.yearly=false;
        this.newReservation.typeres=this.selectedType;
        this.newReservation.visibilitytyperes=this.selectedV;
        this.newReservation.room=this.selectedRoom;
        this.newReservation.stateres = true;
        this.newReservation.reccurenceNumber= this.numberoc;
        console.log(this.choiceenddate);
        this.reservationService.sendDailyReservation(this.newReservation).subscribe(
            data => {
                //this.newReservation = new Reservation();
                this.message = JSON.stringify(data.text());
                console.log(this.message);
                $('#smallAlertModal').modal();
            },
            error => console.log(error)
        );
    };

    checkRequest(reservation:Reservation){

        this.reservationService.sendCheckRequest(reservation).subscribe(
            data => {
                this.message = JSON.stringify(data.text());
                console.log(this.message);
                if(this.message != ""){
                    $('#smallAlertModal').modal();
                }
            },
            error => console.log(error)
        );

    };

    onSubmitWeekly(){};

    onSubmitMonthly(){

        var startDatemonthly;
        var recmonthly;
        var starttimemonthly;
        var endtimemonthly ;

        startDatemonthly= $('#startDatemonthly').data('date');

        starttimemonthly= $('#starttimemonthly').data('date');
        endtimemonthly=$('#endtimemonthly').data('date');

        recmonthly= $('#recdaily').data('date');

        console.log(startDatemonthly.toString());
        console.log(recmonthly.toString());

        console.log(starttimemonthly.toString());
        console.log(endtimemonthly.toString());

        this.num = 6;
        this.user.id=this.num ;
        this.user.stateuser= true;
        this.user.mail="maroua.drissi@sofrecom.com";
        this.user.name="maroua drissi";

        this.newReservation.reservedby= this.user;
        this.newReservation.startdate = startDatemonthly;
        //this.newReservation.enddate = this.dt;
        this.newReservation.starttime = starttimemonthly;
        this.newReservation.endtime = endtimemonthly;
        this.newReservation.allday = false;
        this.newReservation.simple=false;
        this.newReservation.daily=false;
        this.newReservation.weekly=false;
        this.newReservation.monthly=true;
        this.newReservation.yearly=false;
        this.newReservation.typeres=this.selectedType;
        this.newReservation.visibilitytyperes=this.selectedV;
        this.newReservation.room=this.selectedRoom;
        this.newReservation.stateres = true;
        this.newReservation.reccurenceNumber= this.numberoc;
        console.log(this.choiceenddate);
        this.reservationService.sendMonthlyReservation(this.newReservation).subscribe(
            data => {
                this.newReservation = new Reservation();
            },
            error => console.log(error)
        );
    };

    onSubmitYearly(){};

    onReset(){
        //document.forms['form1'].reset();

    }

    /*onSearch(){
        $('.showinfo').click(function(e){
            e.preventDefault();
            $(this).closest('td').find(".test").toggle();
        });
    };*/

    ngOnInit(){

        $.getScript('../../../assets/js/plugins/jquery.bootstrap-wizard.js');
        $.getScript('../../../../assets/js/plugins/bootstrap-datetimepicker.js');
        $.getScript('../../../../assets/js/plugins/jquery.tagsinput.js');
        //$.getScript('../../../../assets/js/core/summernote.min.js');

        initDatetimepickers();
        initWizard();
        initDataTable();
        $('.modal').appendTo("body");

        /*$(document).ready(function(){
           $('#description').summernote();
        });*/

    }


}
