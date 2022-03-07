import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import {TranslateModule } from 'ng2-translate';

@NgModule({
    imports: [ RouterModule, CommonModule,
        TranslateModule.forRoot()],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
