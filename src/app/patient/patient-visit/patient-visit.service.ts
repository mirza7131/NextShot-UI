import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { environment } from 'src/environments/environment';
import { PatientVisit } from './patient-visit';


@Injectable({
  providedIn: 'root'
})
export class PatientVisitService extends ResourceService<PatientVisit>{

  constructor(private http: HttpClient) {
    super(http, PatientVisit, `${environment.patientApiURL}${EndPointConstant.PatientOpenVisit.Controller}`);
  }


  getPatientVisitsListWithDetail(paginatorModel:any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientOpenVisit.GetPatientVisitsListWithDetail()}` + '?'+ this.encodeQueryData(paginatorModel));

  }
  getIPdPatientVisitsListWithDetail(paginatorModel:any): Observable<any> {

    return this.http.get(`${environment.patientApiURL}${EndPointConstant.PatientOpenVisit.GetIPDPatientVisitsListWithDetail()}` + '?'+ this.encodeQueryData(paginatorModel));

  }
  
}
