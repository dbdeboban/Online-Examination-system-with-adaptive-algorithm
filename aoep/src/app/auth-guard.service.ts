import { Injectable } from '@angular/core';

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor( private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    if(localStorage.getItem('testToken')){
      this.router.navigate(['/test'])
      return false;
    }
    else if(localStorage.getItem('token')){
      this.router.navigate(['/profile']);
      return false;
    } 
    else {
      return true;
    }


  }
}
