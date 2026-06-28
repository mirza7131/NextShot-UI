import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { environment } from 'src/environments/environment';
import { HealthFacilityStation } from './health-facility-station';

@Injectable({
  providedIn: 'root'
})
export class HealthFacilityStationService extends ResourceService<HealthFacilityStation> {

  constructor(private http: HttpClient) {
    super(http, HealthFacilityStation, environment.apiURL + EndPointConstant.HealthFacilityStation.Controller);
  }
  
  getAllStationWithDetails(paginatorModel?:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityStation.getAllStationWithDetails()}`+ this.encodeQueryData(paginatorModel));
  }

  getAllWithDepartment(): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityStation.GetAllWithDepartment()}`);
  }

  getHfDepartmentsByHealthFacility(): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityStation.GetHfDepartmentsByHealthFacility()}`);
  }
}
