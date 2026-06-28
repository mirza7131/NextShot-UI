import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { Menu } from './menu';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';


@Injectable({
  providedIn: 'root'
})

export class MenuService extends ResourceService<Menu>{

  constructor(private http: HttpClient) {
    super(http, Menu, environment.apiURL + EndPointConstant.Menu.Controller);
  }


  // Modules
  getAllModules(): Observable<any> {
    return this.http.get(environment.apiURL + EndPointConstant.Menu.GetAllModules());
  }

  getAllMenuAccessByUserRole(): Observable<any> {
    return this.http.get(environment.apiURL + EndPointConstant.Menu.GetAllMenuAccessByUserRole());
  }

  GetCompleteModuleListByRoleId(roleId:string): Observable<any> {
    return this.http.get(environment.apiURL + EndPointConstant.Menu.GetCompleteModuleListByRoleId() + roleId);
  }

  getAllUserPermissions(): Observable<any> {
    return this.http.get(environment.apiURL + EndPointConstant.Menu.GetAllUserPermissions());
  }

  getModulesListByRoleId(roleId:string): Observable<any> {
    return this.http.get(environment.apiURL + EndPointConstant.Menu.GetModuleListByRoleId() + roleId);
  }
}
