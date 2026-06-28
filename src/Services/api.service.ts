import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '';
  private authKey = '396ea9b3-d701-4370-8321-f9845d34c8f8';
  private Token = '';

  constructor(private configService: ConfigService, private http: HttpClient) 
  {
    this.baseUrl = this.configService.apiUrl;
  }

  private getHeaders(): HttpHeaders {
    // You can add custom headers here if needed
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'AuthKey': this.authKey
    });
  }

  get(controller: string, action: string, params?: any): Observable<any> {
    const url = `${this.baseUrl}/${controller}/${action}`;

    // Add parameters to the request if available
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    // const options = { headers: this.getHeaders(), params: httpParams };
    const options = {params: httpParams };
    return this.http.get(url, options);
  }

  post(controller: string, action: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${controller}/${action}`;
    const options = {headers: this.getHeaders() };
    return this.http.post(url, data, options);
  }

  put(controller: string, action: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${controller}/${action}`;
    const options = { headers: this.getHeaders() };
    return this.http.put(url, data, options);
  }

  delete(controller: string, action: string): Observable<any> {
    const url = `${this.baseUrl}/${controller}/${action}`;
    const options = { headers: this.getHeaders() };
    return this.http.delete(url, options);
  }

  postDataWithFormData(controller: string, action: string, obj: any, uploadedFiles: any[]): Observable<any> {
    const url = `${this.baseUrl}/${controller}/${action}`;
    const formData: FormData = new FormData();
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key]);
      }
    }
  
    // Append uploadedFiles array to FormData
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append('uploadedFiles', uploadedFiles[i], uploadedFiles[i].name);
    }

    // Set headers with 'enctype' as 'multipart/form-data'
    const options = {
      headers: new HttpHeaders({
        'AuthKey': this.authKey,
      }),
    };
    
    // options.headers = options.headers.set('Content-Type', 'multipart/form-data');
    console.log(formData);
    return this.http.post(url, formData, options);
  }

  postDataWithFormDataMultiFiles(controller: string, action: string, obj: any, uploadedFiles: any[]): Observable<any> {
    const url = `${this.baseUrl}/${controller}/${action}`;
    const formData: FormData = new FormData();
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key]);
      }
    }
  
    // Append uploadedFiles array to FormData
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append("Keys", uploadedFiles[i].key);
      formData.append("uploadedFiles", uploadedFiles[i], uploadedFiles[i].name);
    }

    // Set headers with 'enctype' as 'multipart/form-data'
    const options = {
      headers: new HttpHeaders({
        'AuthKey': this.authKey,
      }),
    };
    
    // options.headers = options.headers.set('Content-Type', 'multipart/form-data');
    console.log(formData);
    return this.http.post(url,formData, options);
  }

  postobjFiles(controller: string, action: string, obj: any, uploadedFiles: any[]): Observable<any> {
    const url = `${this.baseUrl}/${controller}/${action}`;
    const formData: FormData = new FormData();
    
    // Append uploadedFiles array to FormData
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append("Keys", uploadedFiles[i].key);
      formData.append("uploadedFiles", uploadedFiles[i], uploadedFiles[i].name);
    }
  
    // Append obj as JSON in the FormData
    formData.append('model', JSON.stringify(obj));
  
    // Do not manually set Content-Type here
    const options = {
      headers: new HttpHeaders({
        'AuthKey': this.authKey,
      }),
    };
  
    console.log(formData);
    return this.http.post(url, formData, options);
  }
  
  

}
