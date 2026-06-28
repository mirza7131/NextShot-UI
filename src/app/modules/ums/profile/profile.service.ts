import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Config } from 'src/app/_helpers/config.class';
import { Profile } from './profile';
import { environment } from 'src/environments/environment';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';


@Injectable({
  providedIn: 'root'
})
export class ProfileService extends ResourceService<Profile>{

  constructor(private http: HttpClient) {
    super(http, Profile, environment.apiURL + EndPointConstant.Profile.Controller);
  }

  getAllWithProfileType(paginatorModel: PaginatorModel): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.Profile.GetAllWithProfileType()}` + '?' + this.encodeQueryData(paginatorModel));

  }

  getProfileByProfileType(shortName: string): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.Profile.GetProfileByProfileType()}${shortName}`);
  }

  getProfileByProfileTypeForMLCImages(shortName: string): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.Profile.getProfileByProfileTypeForMLCImages()}${shortName}`);
  }

  GetDataByProfile(shortName: string): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.Profile.GetDataByProfile()}${shortName}`);
  }

}
