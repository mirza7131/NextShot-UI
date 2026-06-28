import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResourceService } from 'src/app/Repository/services/resource.service';
import { User } from './user';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';


@Injectable({
  providedIn: 'root'
})
export class UserService extends ResourceService<User>{

  constructor(private http: HttpClient) {
    super(http, User, `${environment.apiURL}${EndPointConstant.User.Controller}`);
  }

  getHealthfacilityDept(Id:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartment.GetHfDepartmentsByHealthFacility()}${Id}`);
  }

  getDepartmentAndSectionByHealthFacility(Id:any): Observable<any> {

  //   var reqHeader = new HttpHeaders({ 
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + localStorage.getItem('token')
  //  });
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartment.GetDepartmentAndSectionByHealthFacility()}${Id}`);
  }

  getDepartmentSections(Id:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.HealthFacilityDepartmentSection.GetHfDepartmentSectionsByHfDepartmentId()}${Id}`);
  }

  getUserRolesByUserId(userId:string): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.User.GetUserRolesByUserId()}${userId}`);
  }


  getUserAssignableRolesById(userId?:string): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.User.GetUserAssignableRolesById()}${userId}`);
  }

  syncData(obj:any): Observable<any> {
    return this.http.post(`${environment.apiURL}${EndPointConstant.DataSyncToOffline.SyncData()}`, obj);
  }

  getAllWithPagination(paginatorModel?:any): Observable<any> {
    debugger
    return this.http.get(`${environment.apiURL}${EndPointConstant.User.GetAllWithPagination()}`+ this.encodeQueryData(paginatorModel));
  }

  getAll(): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.User.GetAll()}`);
  }

  getAllByUserLevelwise(role:any, healthFacilityId:any = 0): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.User.GetAllByUserLevelwise()}RoleConst=${role}&HealthFacilityId=${healthFacilityId}`);
  }

  getAllDoctorList(role:any, healthFacilityId:any,departmentId:any,sectionId:any): Observable<any> {
    return this.http.get(`${environment.apiURL}${EndPointConstant.User.GetAllByUserLevelwise()}RoleConst=${role}&HealthFacilityId=${healthFacilityId}&DepartmentLookupId=${departmentId}&SectionLookupId=${sectionId}`);
  }
  
  getHrUserByCnic(cnic:string): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.User.GetHrUserByCnic()}${cnic}`);
  }

  getByCnic(cnic:string): Observable<any> {

    return this.http.get(`${environment.apiURL}${EndPointConstant.User.GetByCnic()}${cnic}`);
  }

  getDivision(): Observable<any> {

    return this.http.get(`${environment.apiURL}/Division/GetAll`);
  }

  getDistrict(): Observable<any> {

    return this.http.get(`${environment.apiURL}/District/GetAll`);
  }

  getTehsil(): Observable<any> {

    return this.http.get(`${environment.apiURL}/Tehsil/GetAll`);
  }
  public UpdatePassword(obj:any): Observable<any> {
    return this.http.post(`${this.apiUrl}UpdatePassword`, obj);
  }

}
