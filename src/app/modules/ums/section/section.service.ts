import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Section} from './section';
import { environment } from 'src/environments/environment';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';


@Injectable({
  providedIn: 'root'
})
export class SectionService extends ResourceService<Section>{

  constructor(private http: HttpClient) {
    super(http, Section, environment.apiURL + EndPointConstant.SectionLookup.Controller);
  }

  getAllWithDepartment(paginatorModel?:any): Observable<any> {
    
    return this.http.get(`${environment.apiURL}${EndPointConstant.SectionLookup.GetAllWithDepartment()}?` + this.encodeQueryData(paginatorModel));

  }

  getByDepartmentId(departmentId:number): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.SectionLookup.GetByDepartmentId()}?DepartmentId=${departmentId}`);

  }
//   getAllWithPagination(paginatorModel?:any): Observable<any> {
//     return this.http.get(`${environment.apiURL}${EndPointConstant.ProfileType.GetAllWithPagination()}`+ this.encodeQueryData(paginatorModel));
//   }

}
