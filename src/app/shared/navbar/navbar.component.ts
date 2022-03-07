import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar-routes.config';
import { MenuType } from '../.././sidebar/sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TranslateService } from 'ng2-translate';
import { LoginService } from "../../login/login.service";

declare var require: any;


const initFullCalendar = require('../../../assets/js/init/initFullCalendar.js');
//const initFullCalendar = require('../../../assets/js/init/initFullCalendar.js');
//import initFullCalendar = require('../../assets/js/init/initFullCalendar.js');

declare var $: any;
//const swal = require('../../../../assets/js/plugins/sweetalert2.min.js');

import swal from 'sweetalert2';
{
	const swal = require('sweetalert2');
}

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {

    private listTitles: any[];
    location: Location;

    constructor(location: Location, private translate: TranslateService, private loginService: LoginService) {
        this.location = location;
        translate.addLangs(["en", "fr"]);
        //translate.setDefaultLang("fr");

        //let browserlang = translate.getBrowserLang();
        //translate.use(browserlang.match(/en|fr/) ? browserlang : "en") ;
    }

    changeLanguage(lang) {
        this.translate.use(lang);
		$("#fullCalendarLang").attr("data",lang);
        $('#fullCalendar').fullCalendar('option', 'locale', lang);
        $('#fullCalendar').fullCalendar('render');

    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle.menuType !== MenuType.BRAND);
    }
    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }
    logOut() {
        var self=this;
        swal({
            title: 'Déconnexion',
            text: "Voulez-vous se déconnecter de votre session ?",
			width: 450,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            cancelButtonText: 'Annuler',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn btn-warning',
            buttonsStyling: false
        }).then(function (result) {
             if (result.value) {
                self.loginService.logout();
            }
        }).catch(swal.noop);

    }
    getPath() {
        // console.log(this.location);
        return this.location.prepareExternalUrl(this.location.path());
    }
}
