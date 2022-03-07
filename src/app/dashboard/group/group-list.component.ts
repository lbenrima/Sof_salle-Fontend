/**
 * Created by m.drissi on 20/07/2017.
 */

import { Component, group, OnInit, Inject } from '@angular/core';
import { GroupService } from '../group/group.service';
import { User } from '../user/user';
import { Group } from '../group/group.model';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

declare var require: any;

//import initDataTable = require('../../assets/js/init/initDataTable.js');
import { TranslateService } from "ng2-translate";
declare var $: any;
declare var require: any;
const initDataTable = require('../../../assets/js/init/initDataTable.js');

//const swal = require('../../../../assets/js/plugins/sweetalert2.min.js');
import swal from 'sweetalert2';
{
	const swal = require('sweetalert2');
}

@Component({
    moduleId: module.id,
    selector: 'group-list-cmp',
    providers: [GroupService],
    templateUrl: 'group-list.component.html'
})



export class GroupListComponent implements OnInit {

    ngOnInit() {

        $.getScript('../../../assets/js/plugins/jquery.qtip.js');
        $('.modal').appendTo("body");

    }

    id: number;
    number: number;
    mail: String;
    groups: Group[];
    selectedGroup: Group;
    group: Group = new Group();
    router: Router;

    constructor(private groupService: GroupService, private route: ActivatedRoute, private translate: TranslateService) {
        let self=this;
        this.groupService.getListGroup().subscribe(
            data => {
                this.groups = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                setTimeout(function () {
                    $('#datatables').DataTable(
                        {
                            "pagingType": "full_numbers",
                            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                            responsive: true,
                            language: {
                                "url": self.translate.currentLang  === "en" ? "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/English.json"
                                    : "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json",
                                search: "_INPUT_",
                                //searchPlaceholder: "Search groups",
                            }
                        }
                    );
                }, 20);

            },
            error => { console.log(error) },
        );

        this.route.params.forEach((params: Params) => {
            this.id = Number.parseInt(params['id']);
        }
        )
    }

    onSelect(group: Group) {
        this.selectedGroup = group;
        $('#mail').html(group.mail);
        $('#number').html(group.number);
        $('#info').modal();
    }

	onUpdate()
	{
	}
	
    deleteGrp(group: Group) {
        console.log(group.id);
        this.groupService.deleteGroup(group.id).subscribe(
            data => {
                /*this.group = JSON.parse(JSON.parse(JSON.stringify(data))._body);*/

            },
            error => console.log(error)
        );
    }

    //nclick="SomeDeleteRowFunction(this)" (click)="onDeleteRoom(room)"
}