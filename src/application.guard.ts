import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class applicationGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const targetRoleId = "4da3bb67-cdaf-454f-a545-059198d231c0";
    const admin =  "b74151c9-df31-45b0-9155-2a7b35c71159";
    const Scrutiny =  "c9bdf180-a42f-4dbb-9c15-ca1b07782d4a";

    // const admin =  "5B84BE30-4887-41FB-ADB1-F9AF36D98BF7";

    

    // if (token && roles.some(item => item.Id === targetRoleId || item.Id === admin || item.Id === Scrutiny)) 
      
      if (token ) 
      {
      // User is logged in and has the "Institute" role
      return true;
    } else {
      // User is not logged in or does not have the "Institute" role
      // Redirect to /auth/login
      this.router.navigate(['/auth/login']);
      return false;
    }
  }


}
