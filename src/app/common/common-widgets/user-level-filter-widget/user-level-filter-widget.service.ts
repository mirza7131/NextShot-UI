import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserLevelFilterWidgetService {

  constructor(private http: HttpClient) { }

//   getProvince(): Observable<any> {

//     return this.http.get(`${environment.apiURL}/Province/GetAll`);
//   }

//  getDivision(Id:any): Observable<any> {

//    return this.http.get(`${environment.apiURL}/Division/GetAllByProvinceId?ProvinceId=${Id}`);
//  }

//  getDistrict(Id:any): Observable<any> {

//    return this.http.get(`${environment.apiURL}/District/GetAllByDivisionId?DivisionId=${Id}`);
//  }


//  getTehsil(Id:any): Observable<any> {

//    return this.http.get(`${environment.apiURL}/Tehsil/GetAllByDistrictId?DistrictId=${Id}`);
//  }

  
}
