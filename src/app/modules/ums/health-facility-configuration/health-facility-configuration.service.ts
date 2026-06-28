import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { environment } from 'src/environments/environment';
import { HfLabTestConfig } from './HfLabTestConfig';
import { ResourceService } from 'src/app/Repository/services/resource.service';

@Injectable({
  providedIn: 'root'
})
export class HealthFacilityConfigurationService extends ResourceService<HfLabTestConfig> {

  constructor(private http: HttpClient) {
    super(http, HfLabTestConfig, environment.apiURL + '/HfLabTestConfig/')
  }

  getProfileByProfileType(shortName: string): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.Profile.GetProfileByProfileType()}${shortName}`);
  }

  getAllLabTests(): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.LabTest.GetAll()}`);
  }

  GetHfLabTestConfigByHealthFacilityId(HealthFacilityId:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HfLabTestConfig.GetHfLabTestConfigByHealthFacilityId()}${HealthFacilityId}`);
  }

  getAllConfigHealthFacilitiesByFilters(filter:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HfLabTestConfig.GetAllConfigHealthFacilitiesByFilters()}` + this.encodeQueryData(filter));
  }

  getAllHealthFacilities(filter:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacility.GetAllHealthFacility()}` + this.encodeQueryData(filter));
  }

  createOrEdit(obj:any): Observable<any> {
    return this.http.post(`${environment.apiURL}${EndPointConstant.HfLabTestConfig.CreateOrEdit()}`, obj);
  }
}
