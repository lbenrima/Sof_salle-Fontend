/**
 * Created by m.drissi on 10/08/2017.
 */

import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../room.service';

import 'rxjs/add/operator/do';

import { Room } from "../models/room";
import { Building } from "../models/Building";
import { Floor } from "../models/Floor";
import { Block } from "../models/Block";


declare var $: any;
declare var require: any;

const swal = require('../../../../assets/js/plugins/sweetalert2.min.js');

var route: Router;

@Component({
    moduleId: module.id,
    selector: 'addRoom-cmp',
    providers: [RoomService],
    templateUrl: 'addRoom.component.html'
})

export class AddRoomComponent implements OnInit {

    message: string;

    id: number;
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

    constructor(private route: ActivatedRoute, private roomService: RoomService, private zone: NgZone) {

        this.roomService.getBuildings().subscribe(
            data => {
                this.buildings = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                console.log(this.buildings);
            },
            error => { console.log(error) },
        );

        this.roomService.getBlocks().subscribe(
            data => {
                this.blocks = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                console.log(this.blocks);
            },
            error => { console.log(error) },
        );

        this.roomService.getFloors().subscribe(
            data => {
                this.floors = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                console.log(this.floors);
            },
            error => { console.log(error) },
        );
    }

    reloadPage() { // click handler or similar
        this.zone.runOutsideAngular(() => {
            location.reload();
        });
    }

    onSubmitRoom() {

        console.log(this.selectedBuilding);
        console.log(this.selectedBlock);
        console.log(this.selectedFloor);

        this.newRoom.idfloor = this.selectedFloor;
        this.newRoom.idblock = this.selectedBlock;
        this.newRoom.idbuilding = this.selectedBuilding;

        this.newRoom.pontteleph = this.statePt;
        this.newRoom.videoproj = this.stateVp;
        this.newRoom.visio = this.statevs;
        this.newRoom.adresse = "sofsalle@sofrecom.com";


        this.roomService.sendNewRoom(this.newRoom).subscribe(
            data => {
                //this.newRoom = new Room();
                this.message = JSON.stringify(data.text());
                console.log(this.message);
                //$('#smallAlertModal').modal();
                swal({
                    title: "Ajout avec succès",
                    text: this.message === "\"Successfully added\"" ? "Salle ajoutée avec succès" : "Échec d'ajout de salle",
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-info",
                    animation: false,
                    customClass: 'animated tada'
                }).then(function () {
                    //window.location.reload();
                    document.forms['formadd'].reset();
                    $("#selectedBuilding").val('default');
                    $("#selectedBuilding").selectpicker("refresh");
                    $("#selectedFloor").val('default');
                    $("#selectedFloor").selectpicker("refresh");
                    $("#selectedBlock").val('default');
                    $("#selectedBlock").selectpicker("refresh");
                    $("#stateVp").val('default');
                    $("#stateVp").selectpicker("refresh");
                    $("#statePt").val('default');
                    $("#statePt").selectpicker("refresh");
                    $("#statevs").val('default');
                    $("#statevs").selectpicker("refresh");
                })
                //route.navigate(['room/addroom/addRoom.component'],AddRoomComponent);
                //window.location.reload();
            },
            error => {
                console.log(error)
                swal({
                    title: "Echec d'ajout",
                    text: "Veuillez vérifier vos paramètres",
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-warning"
                });
            }
        );

    }

    ngOnInit() {

        $.getScript('../../../../assets/js/core/jquery.validate.min.js');
        $.getScript('../../../../assets/js/plugins/sweetalert2.min.js');
        $('#registerFormValidation').validate();
        $('#loginFormValidation').validate();
        $('#allInputsFormValidation').validate();
        if ($(".selectpicker").length != 0) {
            setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
            }, 150);

        }

        $('.modal').appendTo("body");

    }


}