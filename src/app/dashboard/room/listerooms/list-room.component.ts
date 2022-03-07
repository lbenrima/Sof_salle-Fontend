/**
 * Created by m.drissi on 10/08/2017.
 */

import { Component, group, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, Params } from '@angular/router';
import { RoomService } from '../room.service';
// import initDataTable = require('../../../../assets/js/init/initDataTable.js');
// import initDataTable = require('../../../../assets/js/init/initDataTable.js');
import { Room } from "../models/room";
import { Building } from "../models/Building";
import { Floor } from "../models/Floor";
import { Block } from "../models/Block";
import { TranslateService } from "ng2-translate";
import {LoginService} from "../../../login/login.service";

declare var $: any;
declare var require: any;
const swal = require('../../../../assets/js/plugins/sweetalert2.min.js');

import { DataTablesModule } from 'angular-datatables';
import { DataTableDirective } from 'angular-datatables';

@Component({
    moduleId: module.id,
    selector: 'room-list-cmp',
    providers: [RoomService],
    templateUrl: 'list-room.component.html'
})

export class ListRoomComponent implements OnInit {

    id: number;
    rooms: Room[];
    room: Room = new Room();

    newRoom: Room = new Room();

    buildings: Building[];
    selectedBuilding: Building = new Building();
    building: Building = new Building();

    floors: Floor[];
    selectedFloor: Floor = new Floor();
    floor: Floor = new Floor();

    blocks: Block[];
    selectedBlock: Block = new Block();
    block: Block = new Block();

    stateVp: boolean;
    statePt: boolean;
    statevs: boolean;


    message: string;

    name: string;
    mail: string;
    phone: number;
    capacity: number;
	color: string;
	dtOptions: DataTables.Settings = {};

	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	
	profile:number = 0;


    constructor( @Inject(Router) private router: Router, private roomService: RoomService, private translate: TranslateService, private loginService : LoginService) {
		this.profile=this.loginService._getUser().profileuser;
        let self = this;

        this.roomService.getRooms().subscribe(
            data => {
                this.rooms = JSON.parse(JSON.parse(JSON.stringify(data))._body);

                setTimeout(function () {
                    $('#roomLst').DataTable(
                        {
                            "pagingType": "full_numbers",
                            "lengthMenu": [[ 10, 25, 50, -1], [ 10, 25, 50, "All"]],
                            responsive: true,
                            language: {
                                "url": self.translate.currentLang === "en" ? "assets/i18n/datatables-en.json"
								: "assets/i18n/datatables-fr.json",
                            }
                        }
                    );
                }, 20);
            },
            error => {
                console.log(error)
            },
        );

        this.roomService.getBuildings().subscribe(
            data => {
                this.buildings = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                // console.log(this.buildings);
            },
            error => {
                console.log(error)
            },
        );

        this.roomService.getBlocks().subscribe(
            data => {
                this.blocks = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                // console.log(this.blocks);
            },
            error => {
                console.log(error)
            },
        );

        this.roomService.getFloors().subscribe(
            data => {
                this.floors = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                // console.log(this.floors);
            },
            error => {
                console.log(error)
            },
        );

    }

    ngOnInit() {
        $.getScript('../../../../assets/js/core/jquery.validate.min.js');
      //  $('#registerFormValidation').validate();
       // $('#loginFormValidation').validate();
       // $('#allInputsFormValidation').validate();

        $('.modal').appendTo("body");
	
		/*this.dtOptions = {
				pagingType: 'full_numbers'
				"lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
				language: {
							"url": this.translate.currentLang === "en" ? "assets/i18n/datatables-en.json"
								: "assets/i18n/datatables-fr.json",
							search: "_INPUT_",
							searchPlaceholder: "Search rooms"
				}
		};*/
				
        if ($(".selectpicker").length != 0) {
            //$(".selectpicker").selectpicker();

            setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
            }, 150);

        }

    }

    onDeleteRoom(room) {
		
		let titleSwal;
		let confirmButtonSwal;
		let cancelButtonSwal;
		this.translate.get("doYouReallyWantToDeleteThisRoom").subscribe((res: string) => {
            titleSwal = res;
        });
		this.translate.get("dl").subscribe((res: string) => {
            confirmButtonSwal = res;
        });
		this.translate.get("cn").subscribe((res: string) => {
            cancelButtonSwal = res;
        });
		
		swal({
		title: titleSwal,
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: confirmButtonSwal,
		cancelButtonText: cancelButtonSwal,
		confirmButtonClass: 'btn btn-primary',
		cancelButtonClass: 'btn btn-warning',
		buttonsStyling: false
        }).then((result) => {
		  if (result) {
			this.roomService.deleteRoom(room.idroom).subscribe(
            data => {
                this.message = JSON.stringify(data);
                var msg = this.message;
                console.log(this.message);
            },
            error => console.log(error),
			);
		  }
		}).catch(swal.noop);
		
        
    }

    onSelectRoom(room) {
        $('#title').html(room.name);
        $('#bld').html(room.idbuilding.namebuilding);
        $('#flr').html(room.idfloor.numfloor);
        $('#blc').html(room.idblock.nameblock);
        $('#mail').html(room.adresse);
        $('#phone').html(room.telephone);
        $('#vd').html(room.videoproj.toString());
        $('#pt').html(room.pontteleph.toString());
        $('#vs').html(room.visio.toString());
        $('#color').html(room.color.toString());
        $('#info').modal();
    };

    onUpdate() {
        this.newRoom.name = this.name;
        this.newRoom.capacity = this.capacity;
        this.newRoom.telephone = this.phone;
        this.newRoom.adresse = this.mail;
        this.newRoom.color = this.color;
        this.newRoom.idfloor = this.selectedFloor;
        this.newRoom.idblock = this.selectedBlock;
        this.newRoom.idbuilding = this.selectedBuilding;
        this.newRoom.pontteleph = $('select[name=statePt]').val();
        this.newRoom.videoproj = $('select[name=stateVp]').val();
        this.newRoom.visio = $('select[name=statevs]').val();
        this.newRoom.idroom = this.id;
        var index = this.rooms.indexOf(this.room);
        this.rooms[index] = this.newRoom;
        this.roomService.updateRoom(this.id, this.newRoom).subscribe(
            data => {
                this.message = JSON.stringify(data);
                var msg = this.message;
                console.log(this.message);

                swal({
                    title: "La salle de réunion est mis à jour",
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-info",
                    animation: false,
                    customClass: 'animated tada'
                })
            },
            error => console.log(error),
        );
    }

    onUpdateRoom(room) {
        $('select[name=stateVp]').val(room.videoproj.toString());
        $('select[name=statevs]').val(room.visio.toString());
        $('select[name=statePt]').val(room.pontteleph.toString());
        $('.selectpicker').selectpicker('refresh');

        this.name = room.name;
        this.capacity = room.capacity;
        this.mail = room.adresse;
        this.phone = room.telephone;
        this.color = room.color;
        this.selectedFloor = room.idfloor;
        this.selectedBlock = room.idblock;
        this.selectedBuilding = room.idbuilding;

        this.id = room.idroom;
        $('#upd').modal();
    };

}
