import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { environment } from 'src/environments/environment';
import { HealthFacilityDepartmentSection } from './health-facility-department-section';

@Injectable({
  providedIn: 'root'
})
export class HealthFacilityDepartmentSectionService extends ResourceService<HealthFacilityDepartmentSection>{

  constructor(private http: HttpClient) {
    super(http, HealthFacilityDepartmentSection, environment.apiURL + EndPointConstant.HealthFacilityDepartmentSection.Controller);
  }

  getAllWithDepartmentSection(): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartmentSection.GetAllWithDepartmentSection()}`);

  }

  getByHfDepartmentId(hfDepartmentId:number): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartmentSection.GetHfDepartmentSectionsByHfDepartmentId()}${hfDepartmentId}`);

  }

  deleteByHfDepartmentId(hfDepartmentId:number): Observable<any> {
    
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartmentSection.DeleteByHfDepartmentId()}${hfDepartmentId}`);

  }
  BulkCreateOrEdit(obj: any): Observable<any> {
     
    return this.http.post(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartmentSection.BulkCreateOrEdit()}`, obj);
  }


}
