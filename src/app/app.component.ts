import {Component, HostListener, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import {TranslateService} from 'ng2-translate';

declare var $:any;
@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit{
    location: Location;
    showSideBar = true;
    constructor(location:Location, private translate:TranslateService) {
        this.showSideBar = true;

        this.location = location;
        translate.addLangs(["en","fr"]);
        translate.setDefaultLang("fr");

        let browserlang = translate.getBrowserLang();
        translate.use(browserlang.match(/en|fr/) ? browserlang : "en") ;
    }

    changeLanguage(lang){
        this.translate.use(lang);
    }

    ngOnInit(){
        $.getScript('../assets/js/init/initMenu.js');
        $.getScript('../assets/js/demo.js');


    }
    public isMap(){
        // console.log(this.location);
        if(this.location.prepareExternalUrl(this.location.path()) == '#/maps/fullscreen'){
            return true;
        }
        else {
            return false;
        }
    }

}
