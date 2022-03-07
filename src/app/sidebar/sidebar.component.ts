import { Component, OnInit, ViewChild } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { MenuType } from './sidebar.metadata';
import {TranslateService} from 'ng2-translate';
import {LoginService} from "../login/login.service";
import { ReservationService } from "../dashboard/calendar/services/reservation.service";
import { Room } from "../dashboard/room/models/room";
import { SidebarService } from './sidebar.service';
import { User } from '../dashboard/user/user';
import {CalendarService} from '../dashboard/calendar/calendar.service';
import { RoomCalendarService } from '../room-calendar.service';
//import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

declare var $: any;
declare var require: any;

import { DataTablesModule } from 'angular-datatables';
import { DataTableDirective } from 'angular-datatables';


//const swal = require('../../../../assets/js/plugins/sweetalert2.min.js');

import swal from 'sweetalert2';
{
    const swal = require('sweetalert2');
}

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.css'],
    providers: [ReservationService],

})

export class SidebarComponent implements OnInit {

    profile: number = 0;
    rooms: Room[];
    dropdownList = [];
    selectedItems = [];
    favoriteRooms: Room[];
    favoriteRoomsCpy: Room[];
    dtOptions: DataTables.Settings = {};

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;



    constructor(private roomCalendarService: RoomCalendarService, private sidebarService: SidebarService, private loginService: LoginService, private reservationService: ReservationService, private translate: TranslateService) {

    }

    favCalendars = [];
    dropdownSettings = {};

    public menuItems: any[];
    ngOnInit() {
        if (this.loginService._getUser() != null) {

            this.dtOptions = {
                "pagingType": "simple_numbers",
                "pageLength": 5,
                "lengthChange": false,
                language: {
                    "url": this.translate.currentLang === "en" ? "assets/i18n/datatables-en.json"
                        : "assets/i18n/datatables-fr.json",
                    search: "_INPUT_",
                    searchPlaceholder: "Search rooms",
                }
            };

            $.getScript('../../assets/js/sidebar-moving-tab.js');
            this.menuItems = ROUTES.filter(menuItem => menuItem.menuType !== MenuType.BRAND);

            this.profile = this.loginService._getUser().profileuser;
            // console.log(this.profile);
            this.getFavoriteCalendars();
            this.reservationService.getListRoom().subscribe(
                data => {
                    this.rooms = JSON.parse(JSON.parse(JSON.stringify(data))._body);

                    //			for( let i = 0; i < this.rooms.length ; i++)
                    //				this.dropdownList.push({"id":this.rooms[i].idroom, "itemName" :this.rooms[i].name, "category":this.rooms[i].idbuilding.namebuilding});
                    //this.dropdownList.push(JSON.parse(JSON.stringify({"id":rooms[i].idroom,"itemName":rooms[i].name,"category":rooms[i].adresse})));
                },
                error => { console.log(error) }
            );







            this.favCalendars = ['Elyssa', 'Salambo'];

        }

    }

    onUpdateSelectFavCalendar(room, event) {
        var cIdx = this.selectedItems.indexOf(room);
        if (event.target.checked) {
            if (cIdx < 0)
                this.selectedItems.push(room);
        } else
            this.selectedItems.splice(cIdx, 1);

    }

    prefredRoomsChanged(event, room: Room) {
        if (!event.target.checked) {
            this.favoriteRoomsCpy = this.favoriteRoomsCpy.filter(r => r.name != room.name);
        } else {
            this.favoriteRoomsCpy.push(room);
        }
        this.roomCalendarService.toggleIdentifier(this.favoriteRoomsCpy);
    }


    onItemSelect(item: any) {
        console.log(item);
        console.log(this.selectedItems);
    }
    OnItemDeSelect(item: any) {
        console.log(item);
        console.log(this.selectedItems);
    }
    onSelectAll(items: any) {
        console.log(items);
    }
    onDeSelectAll(items: any) {
        console.log(items);
    }

    logOut() {
        this.loginService.logout()
    }

    get fullName(): any {
        return localStorage.getItem('nameUser');
    }

    AddFavCalendar() {
        $('#addCalendar').modal();

    }
    saveFavoriteCalendar() {
        let user = new User();
        user.rooms = this.selectedItems;
        user.mail = localStorage.getItem("currentUserName");
        this.sidebarService.addFavoriteCalendar(user).subscribe(data => {
            this.favoriteRooms = JSON.parse(data['_body']);
            this.favoriteRoomsCpy = JSON.parse(data['_body']);
            this.roomCalendarService.toggleIdentifier(this.favoriteRooms);

        }, error => { console.log('error ' + error); }
        );

    }
    getFavoriteCalendars() {
        this.sidebarService.getFavoriteCalendars().subscribe(data => {
            this.favoriteRooms = JSON.parse(data['_body']);
            this.favoriteRoomsCpy = JSON.parse(data['_body']);
        }, error => { console.log('got favorite cal error ' + error); });
    }

}
