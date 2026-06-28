import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MenuChangeEvent } from './api/menuchangeevent';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { Menu } from 'src/app/modules/ums/menu/menu';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
// import { Menu } from 'primeng/menu';


@Injectable({
    providedIn: 'root'
})
export class MenuService extends ResourceService<Menu> {


    constructor(private http: HttpClient) {
        super(http, Menu, environment.apiURL + EndPointConstant.Menu.Controller);
      }


    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

   


    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }



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
