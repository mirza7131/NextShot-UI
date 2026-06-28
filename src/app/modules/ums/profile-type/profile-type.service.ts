import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { ProfileType} from './profile-type';
import { environment } from 'src/environments/environment';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class ProfileTypeService extends ResourceService<ProfileType>{

  constructor(private http: HttpClient) {
    super(http, ProfileType, environment.apiURL + EndPointConstant.ProfileType.Controller);
  }

  getAllWithPagination(paginatorModel?:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.ProfileType.GetAllWithPagination()}`+ this.encodeQueryData(paginatorModel));
  }

}
