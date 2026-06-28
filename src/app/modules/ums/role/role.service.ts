import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { Role } from './role';
import { Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';


@Injectable({
  providedIn: 'root'
})

export class RoleService extends ResourceService<Role>{

  constructor(private http: HttpClient) {
    super(http, Role, environment.apiURL + EndPointConstant.Role.Controller);
  }

  getAllWithPagination(paginatorModel?:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.Role.GetAllWithPagination()}`+ this.encodeQueryData(paginatorModel));
  }
}
