import { Injectable } from '@angular/core';
import { ErrorLog } from './error-log';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ErrorLogService extends ResourceService<ErrorLog>{

  constructor(private http: HttpClient) {
    super(http, ErrorLog, environment.apiURL + EndPointConstant.ErrorLog.Controller);
  }
  
  
  getAllWithPagination(paginatorModel: PaginatorModel): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.ErrorLog.GetAllWithPagination()}` + '?' + this.encodeQueryData(paginatorModel));

  }

  

}
