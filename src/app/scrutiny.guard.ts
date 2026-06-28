import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // This makes the guard available throughout the app
})

export class scrutinyGuard implements CanActivateChild {
  constructor(private router: Router) {}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> 
  {
    debugger
    const token = localStorage.getItem('token');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const targetRoleId = "4da3bb67-cdaf-454f-a545-059198d231c0";
    const scrutiny =  "c9bdf180-a42f-4dbb-9c15-ca1b07782d4a";

    if (token && roles.some(item => item.Id === scrutiny))
    {
      // User is logged in and has the "Institute" role
      return true;
    } 
    else {
      // User is not logged in or does not have the "Institute" role
      // Redirect to /auth/login
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
};
