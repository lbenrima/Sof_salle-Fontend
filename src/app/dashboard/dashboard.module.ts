import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {TranslateModule } from 'ng2-translate';
import { DataTablesModule } from 'angular-datatables';


//import { MODULE_ROUTES,MODULE_COMPONENTS } from './dashboard.routes';
import { MODULE_COMPONENTS } from './dashboard.routes';
import {Login} from "../login/login.component";
import {Report} from "../report/report.component";
import {LoginService} from "../login/login.service";
import {AuthGard} from "../auth.guard";
import {CalendarService} from './calendar/calendar.service';

@NgModule({
    imports: [
        BrowserModule,
        //RouterModule.forChild(MODULE_ROUTES),
        FormsModule,
        TranslateModule.forRoot(),
		DataTablesModule
		],
    declarations: [ MODULE_COMPONENTS,Login, Report],
    providers:[LoginService,AuthGard, CalendarService]
})

export class DashboardModule{}
