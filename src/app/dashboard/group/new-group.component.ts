/**
 * Created by m.drissi on 19/07/2017.
 */
import { Component, OnInit } from '@angular/core';
import { GroupService } from '../group/group.service'
import { Group } from './group.model'
import { GroupCollab } from './groupCollab'
import { Member } from './member.model'
import { User } from '../user/user'
import { Collab } from '../user/collab'
import { error } from "util";
import { Router } from '@angular/router';
import { ReservationService } from "../forms/wizard/reservation.service";


import swal from 'sweetalert2';
{
	const swal = require('sweetalert2');
}

//import initDataTable = require('../../assets/js/init/initDataTable.js');

declare var $: any;
declare var require: any;

const initDataTable = require('../../../assets/js/init/initDataTable.js');



@Component({
    moduleId: module.id,
    selector: 'group-cmp',
    providers: [GroupService, ReservationService],
    templateUrl: 'new-group.component.html'
})

export class GroupComponent implements OnInit {
    num: number;
    newGroup: Group = new Group();
    user: User = new User();
    msg: string;

    collabs: Collab[];
    selectedCollab: Collab[];
    collb: Collab = new Collab();

    groupCollab: GroupCollab = new GroupCollab();

    constructor(private groupService: GroupService, private reservationService: ReservationService) {

        this.reservationService.getListCollabs().subscribe(
            data => {
            this.collabs = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                setTimeout(function () {
                    $('#listCollabs').DataTable(
                        {
                            "pagingType": "full_numbers",
                            "lengthMenu": [[5, 7], [5, 7]],
                            responsive: true,
                            language: {
                                search: "_INPUT_",
                                searchPlaceholder: "Search here",
                            }
                        }
                    );
                }, 20);
            },
            error => { console.log(error) },
        );
        //var col = this.collabs[0];
        this.selectedCollab = [];
    }

    onSubmit() {
        this.user.mail = window.localStorage.getItem("currentUserName");
        this.user.name = sessionStorage.getItem("nameUser");

        this.groupCollab.user = this.user;

        this.groupCollab.grp = this.newGroup;
        this.groupCollab.collabs = this.selectedCollab;

        this.groupService.sendGroup(this.groupCollab).subscribe(
            data => {
                var mail = this.groupCollab.grp.mail;
                this.groupCollab = new GroupCollab();
                swal({
                    title: "Ajout avec succès",
                    text: "Groupe ajouté avec succès",//mail,
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-info",
                    animation: false,
                    customClass: 'animated tada'
                }).then(() => {
                    document.forms['grpAdd'].reset();

                })
            },
            error => console.log(error)
        );


        this.msg = JSON.stringify(this.selectedCollab);
        console.log(this.msg);
    };


    onSelectionCollabChange(collb, event) {
        var cbIdx = this.selectedCollab.indexOf(collb);
        if (event.target.checked) {
            if (cbIdx < 0)
                this.selectedCollab.push(collb);
        } else {
            if (cbIdx >= 0)
                this.selectedCollab.splice(cbIdx, 1);
        }
    }

    ngOnInit() {

        $.getScript('../../../../assets/js/core/jquery.validate.min.js');
        $('#registerFormValidation').validate();
        $('#loginFormValidation').validate();
        $('#allInputsFormValidation').validate();
    }
}