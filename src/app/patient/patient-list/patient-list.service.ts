import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { environment } from 'src/environments/environment';
import { Patient } from '../patientmodel';


@Injectable({
  providedIn: 'root'
})
export class PatientListService extends ResourceService<Patient>{

  constructor(private http: HttpClient) {
    super(http, Patient, `${environment.patientApiURL}${EndPointConstant.Patient.Controller}`);
  }
}
