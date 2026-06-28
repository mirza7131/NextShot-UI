import { Injectable } from '@angular/core';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { Attachment } from '../common-models/attachment';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService extends ResourceService<Attachment>{
  
  constructor(private http: HttpClient) {
    super(http, Attachment, `${environment.apiURL}${EndPointConstant.Attachment.Controller}`);
  }
}
