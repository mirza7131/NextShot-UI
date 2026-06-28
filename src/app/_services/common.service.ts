import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EndPointConstant } from '../core/constants/endpoint.constants';
import { LocalService } from 'src/app/_services/local.service';

@Injectable({
providedIn: 'root'
})

export class CommonService 
{
        
    constructor(
        private http: HttpClient,private _localService: LocalService,
    ) 
    {   
    }

    getAllLocations(): Observable<any> {
    //     const token = localStorage.getItem('token');
    //     // const token = this._localService.getValue('token'); // Replace with your actual token
    //    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);



    //    var reqHeader = new HttpHeaders({ 
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + localStorage.getItem('token')
    //  });

       
        return this.http.get(`${environment.apiURL}${EndPointConstant.Province.GetAllLocations()}`);
    }
    GetAllLocationsFilters(): Observable<any> {

        return this.http.get(`${environment.apiURL}${EndPointConstant.Province.GetAllLocationsFilters()}`);
    }
    

}