
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {LoginService} from "./login/login.service";
@Injectable()
export class AuthGard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let allow = Observable.of([
      this.loginService.checkLogin()
    ]);
    return allow.map(authInfo => { return authInfo[0]; }).take(1).do(allowed => {

      if (!allowed) {
        return this.router.navigate(['/login']);
      }
    });
  }

}
