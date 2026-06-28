import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { environment } from 'src/environments/environment';
import { HealthFacility } from './health-facility';

@Injectable({
  providedIn: 'root'
})

export class HealthFacilityService extends ResourceService<HealthFacility>{

  constructor(private http: HttpClient) {
    super(http, HealthFacility, environment.apiURL + EndPointConstant.HealthFacility.Controller);
  }

  getAllWithPagination(paginatorModel?:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacility.GetAllWithPagination()}`+ this.encodeQueryData(paginatorModel));
  }
  getAllForConsignment(paginatorModel?:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacility.GetAllForConsignment()}`);
  }
}
