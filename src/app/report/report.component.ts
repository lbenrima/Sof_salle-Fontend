import { Component, forwardRef, HostListener, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReportService } from '../report/report.service';
import { Router } from "@angular/router";
import { AppComponent } from "../app.component";

declare var $: any;

@Component({
    selector: 'report',
    templateUrl: 'report.component.html',
	providers: [ ReportService ]

})
export class Report {
    public report = { 'from': '', 'subject': '', 'description': '' };
    private currentUserName;
    private fullName: string; 
    public errormsg: string = undefined;


    constructor(private router: Router, private reportService: ReportService, @Inject(forwardRef(() => AppComponent)) private _parent: AppComponent) {
        this.currentUserName = localStorage.getItem("currentUserName");
        this.loadScript('assets/js/app.js');
        this._parent.showSideBar = false;
        sessionStorage.setItem('nameUser', "");

    }

    onSubmit() {
		this.reportService.sendMail(this.report).subscribe(
            data => {
				this.router.navigate(['/calendar']);

            },
            error => {
                this.errormsg = "Echec d'envoi";
                // console.log(error)
            }
        );
        
    }

   
    public loadScript(url) {
        const node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
    }


}
