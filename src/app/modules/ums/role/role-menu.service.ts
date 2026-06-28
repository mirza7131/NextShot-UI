import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResourceService } from 'src/app/Repository/services/resource.service'; 
import { RoleMenu } from './role';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoleMenuService extends ResourceService<RoleMenu>{

  constructor(private http: HttpClient) {
    super(http, RoleMenu, environment.apiURL + '/Role');
  }

  getRoleMenuAccess(roleId?:string): Observable<any> {  

    if(!roleId)
      return this.http.get(`${environment.apiURL}${EndPointConstant.RoleMenu.GetRoleMenuAccess()}`);  
    else
      return this.http.get(`${environment.apiURL}${EndPointConstant.RoleMenu.GetRoleMenuAccessByRoleId()}${roleId}`); 
  }

}
