import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'src/app/_services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  private totalRequests = 0;
  skipUrls: Array<string>;

  constructor(
    private loaderService: LoaderService
  ) 
  {
    this.skipUrls= [
      'PatientVital/GetAllQue',
      'PatientDiagnose/GetAllQue',
      'MedicineDispatch/GetAllQue',
      'Patient/CreateOrEditWithVisit'
    ];
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    debugger
    if (this.isValidRequestForInterceptor(request.url)) 
    {
      this.totalRequests++;
      this.loaderService.setLoading(true);
      return next.handle(request).pipe(
        finalize(() => {
          this.totalRequests--;
          if (this.totalRequests == 0) {
            this.loaderService.setLoading(false);
          }
        })
      );
    }
    return next.handle(request);
  }

  private isValidRequestForInterceptor(requestUrl: string): boolean {
    let positionIndicator: string = 'api/';
    let position = requestUrl.indexOf(positionIndicator);
    if (position > 0) {
      let destination: string = requestUrl.substr(position + positionIndicator.length);
      for (let address of this.skipUrls) {
        if (new RegExp(address).test(destination) && new RegExp('HideLoader').test(destination)) {
          return false;
        }
      }
    }
    return true;
  }
}
