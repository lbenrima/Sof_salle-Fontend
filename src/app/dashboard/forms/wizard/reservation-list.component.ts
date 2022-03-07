/**
 * Created by m.drissi on 20/07/2017.
 */

import {Component, group, OnInit} from '@angular/core';
import {ReservationService} from  './reservation.service'
import {Reservation} from './reservation';

import {User} from '../../user/user';
import {Group} from '../../group/group.model';
import {GroupService} from '../../group/group.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import {Room} from "../../room/models/room";
import {RoomService} from "../../room/room.service";

declare var require: any;

const initDatetimepickers = require('../../../../assets/js/init/initDatetimepickers.js');
const initDataTable = require('../../../../assets/js/init/initDataTable.js');
//import initDatetimepickers = require('../../../assets/js/init/initDatetimepickers.js');
//import initDataTable = require('../../../assets/js/init/initDataTable.js');
declare var $:any;
const swal = require('../../../../assets/js/plugins/sweetalert2.min.js');

@Component({
    moduleId: module.id,
    selector: 'reservation-list-cmp',
    providers: [GroupService, ReservationService, RoomService],
    templateUrl: 'reservation-list.component.html'
})


export class ReservationListComponent  implements OnInit{

    id : number;
    reservations: Reservation[];
    selectedReservation: Reservation;
    reservation : Reservation= new Reservation();
    router : Router;

    message:string;
    rooms: Room[];
    selectedRoom: Room= new Room();
    meetingRoom : Room= new Room();

    ngOnInit()
    {

        $.getScript('../../../../assets/js/plugins/bootstrap-datetimepicker.js');
        $.getScript('../../../../assets/js/plugins/jquery.tagsinput.js');

        initDatetimepickers();

        $('.modal').appendTo("body");

        if ($(".selectpicker").length != 0) {
            //$(".selectpicker").selectpicker();

            setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
            }, 150);

        }

    }

    constructor (private reservationService: ReservationService,  private route: ActivatedRoute, private roomService:RoomService) {

        this.reservationService.getListRoom().subscribe(
            data => {  console.log(this.rooms = JSON.parse(JSON.parse(JSON.stringify(data))._body));
                setTimeout(function(){ $('#tableroomsUpd').DataTable(
                    {
                        "pagingType": "full_numbers",
                        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                        responsive: true,
                        language: {
                            search: "_INPUT_",
                            searchPlaceholder: "Search rooms",
                        }
                    }
                ); }, 1000);
            },
            error => {console.log(error)},
        );

        this.reservationService.getListReservation().subscribe(
            data => {  console.log(this.reservations = JSON.parse(JSON.parse(JSON.stringify(data))._body));
            //initDataTable();
                setTimeout(function(){ $('#resList').DataTable(
                    {
                        "pagingType": "full_numbers",
                        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                        responsive: true,
                        language: {
                            search: "_INPUT_",
                            searchPlaceholder: "Search here",
                        }
                    }
                ); }, 1000);
            },
            error => {console.log(error)},
        );

    }

    onSelect(reservation:Reservation) {
        this.selectedReservation = reservation;
        $('#title').html(this.selectedReservation.title);
        let p;
        if(this.selectedReservation.simple == true){
            p= "simple reservation";
        }
        else if(this.selectedReservation.daily == true){
            p= "daily reservation";
        }
        else if(this.selectedReservation.weekly == true){
            p= "weekly reservation";
        }
        else if(this.selectedReservation.monthly == true){
            p= "monthly reservation";
        }
        else if(this.selectedReservation.yearly == true){
            p= "yearly reservation";
        }
        $('#per').html(p);
        $('#info').modal();
    }

    onEditRes(reservation:Reservation){
        this.selectedReservation = reservation;
        let sd = this.selectedReservation.startdate;
        let st = this.selectedReservation.starttime;
        let et=this.selectedReservation.endtime;

        if(this.selectedReservation.simple == true){
            let ed = this.selectedReservation.enddate;
            $('#nameSupd').html(this.selectedReservation.title);
            $('#starttimesud').val(st);
            $('#endtimesupd').val(et);
            $('#startsupd').val(sd);
            this.selectedRoom = this.selectedReservation.room;
            let room =this.selectedRoom.idroom.toString();
            //$('#room').click();
            //$("input[name=roomselected]").val([room]);
            //$('input[id=room][value=roomselected]').prop("checked",true);
            //$('input[name="roomselected"][value=room]').attr('checked', true);
            //$("input[name='roomselected'][value=room]").prop("checked",true);
            //$("#room").prop('checked',true);
            //$("input[name='roomselected']").button("refresh");
            //$('input:radio[name="sroom"]').filter('[value=room]').attr('checked', true);
            //$("[name='sroom']").val([room]);
            $("input[name=sroom][value=" + this.selectedRoom.idroom.toString() + "]").attr('checked', 'checked');
            //$('input:radio[name=sroom]').val([room]);
            $('#simpleResUpd').modal();
        }
        else if(this.selectedReservation.daily == true){
            $('#info').modal();
        }
        else if(this.selectedReservation.weekly == true){
            $('#info').modal();
        }
        else if(this.selectedReservation.monthly == true){
            $('#info').modal();
        }
        else if(this.selectedReservation.yearly == true){
            $('#info').modal();
        }

    }

    deleteRes(reservation:Reservation) {

        this.reservationService.deleteReservation(reservation.idreservation).subscribe(
            data =>{
                this.message = JSON.stringify(data);
                var msg= this.message;
                console.log(this.message);
            },
            error => console.log(error),
        );
        console.log(reservation.idreservation);
    }
	
	update()
	{
	}

}