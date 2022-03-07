import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import {Http} from '@angular/http';
import {TranslateModule, MissingTranslationHandler, TranslateStaticLoader, TranslateLoader} from 'ng2-translate';

import { APP_BASE_HREF } from '@angular/common';

// import { ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { AppComponent }   from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { DashboardModule } from './dashboard/dashboard.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { HashLocationStrategy, LocationStrategy, DatePipe } from '@angular/common';
import { MyMissingTranslationHandler } from './missingTemplate.component';

import {AuthGard} from "./auth.guard";
import { Configuration } from "./app.constants";

import {TranslatePipe} from './translate/translate.pipe';
import { AppRoutingModule } from './app.routing';
import { RoomCalendarService } from './room-calendar.service';


@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        DashboardModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        HttpModule,
		AppRoutingModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(
		{ 
          provide: TranslateLoader,
          useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'), deps: [Http] 
		},
		),
		
    ],
    declarations: [ AppComponent, DashboardComponent, TranslatePipe],
    providers: [Configuration,DatePipe,{provide: LocationStrategy, useClass: HashLocationStrategy},{provide: MissingTranslationHandler, useClass:MyMissingTranslationHandler},AuthGard, RoomCalendarService],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
