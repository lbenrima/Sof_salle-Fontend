import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import {TranslateModule } from 'ng2-translate';
import { FormsModule }         from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SidebarService } from './sidebar.service';
import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
    imports: [ RouterModule, CommonModule,
        TranslateModule.forRoot(),
		FormsModule,
		DataTablesModule,
        DashboardModule,
		],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ],
	providers: [SidebarService]
})

export class SidebarModule {}
