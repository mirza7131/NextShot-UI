import { Injectable } from '@angular/core';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { Department } from './department';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends ResourceService<Department> {

  constructor(private http: HttpClient) {
    super(http, Department, environment.apiURL + EndPointConstant.DepartmentLookup.Controller);
  }

  getAllWithPagination(paginatorModel?:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.DepartmentLookup.GetAllWithPagination()}`+ this.encodeQueryData(paginatorModel));
  }
}
