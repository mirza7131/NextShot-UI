import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { environment } from 'src/environments/environment';
import { HealthFacilityDepartment } from './health-facility-department';


@Injectable({
  providedIn: 'root'
})
  
export class HealthFacilityDepartmentService extends ResourceService<HealthFacilityDepartment>{

  constructor(private http: HttpClient) {
    super(http, HealthFacilityDepartment, environment.apiURL + EndPointConstant.HealthFacilityDepartment.Controller);
  }
  
  getAllWithDepartment(paginatorModel?:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartment.GetAllWithDepartment()}`+ this.encodeQueryData(paginatorModel));
  }

  getHfDepartmentsByHealthFacility(): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartment.GetHfDepartmentsByHealthFacility()}`);

  }  
}
