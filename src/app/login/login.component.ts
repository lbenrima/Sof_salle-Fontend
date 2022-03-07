import { Component, forwardRef, HostListener, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';
import { Router } from "@angular/router";
import { AppComponent } from "../app.component";

declare var $: any;

@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class Login {
    // private model = { 'username': 'rhouma.sokrafi@sofrecom.com', 'password': 'Sofrecom123#' };
    public model = { 'username': '', 'password': '' };
    private currentUserName;
    private fullName: string; 
    public errormsg: string = undefined;


    constructor(private router: Router, private loginService: LoginService, @Inject(forwardRef(() => AppComponent)) private _parent: AppComponent) {
        this.currentUserName = localStorage.getItem("currentUserName");
        this.loadScript('assets/js/app.js');
        this._parent.showSideBar = false;
        sessionStorage.setItem('nameUser', "");

    }

    onSubmit() {

        function capitalize(s) {
            return s[0].toUpperCase() + s.slice(1);
        }

        this.loginService.sendCredential(this.model).subscribe(
            data => {
                localStorage.setItem("token", JSON.parse(JSON.stringify(data))._body);
                // console.log(JSON.parse(JSON.stringify(data)));
                // console.log(JSON.parse(JSON.stringify(data))._body);
                // console.log(localStorage.getItem("token"));
                this.loginService.sendToken(localStorage.getItem("token"), this.model.username).subscribe(
                    data => {
                        this.errormsg = undefined;
                        var user = JSON.parse(JSON.parse(JSON.stringify(data))._body)[0];
                        this.currentUserName = user.mail;
                        localStorage.setItem("currentUserName", this.currentUserName);
                        let index1 = this.currentUserName.indexOf('.');
                        let index2 = this.currentUserName.indexOf('@');
                        let firstName = capitalize(this.currentUserName.substring(0, index1));
                        let lastName = this.currentUserName.substring(index1 + 1, index2).toUpperCase();
                        this.fullName = lastName + ' ' + firstName;

                        // console.log(JSON.parse(JSON.stringify(data)));
                        localStorage.setItem("User", JSON.parse(JSON.stringify(data))._body);
                        sessionStorage.setItem("nameUser", this.fullName);
                        localStorage.setItem("nameUser", this.fullName);
                        // console.log(sessionStorage.getItem('nameUser'));
                        this.model.username = '';
                        this.model.password = '';
                        this.showNotification();
                        this.router.navigate(['/calendar']);
                    },
                    error => {
                        this.errormsg = "Erreur d'authentification";
                        // console.log(error)
                    }
                );
            },
            error => {
                this.errormsg = "Erreur d'authentification";
                // console.log(error)
            }
        );
    }

    showNotification() {
        // message: "       " +"Welcome" + "  " +  sessionStorage.getItem("nameUser")
        $.notify({
            icon: "verified_user",
            message: "       " + "Bonjour " + "  " + localStorage.getItem("nameUser")

        }, {
                type: 'warning',
                timer: 1500,
                placement: {
                    from: 'bottom',
                    align: 'right'
                },
                animate: {
                    enter: 'animated lightSpeedIn',
                    exit: 'animated lightSpeedOut'
                }
            },
        );
    }
    public loadScript(url) {
        const node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
    }


}
