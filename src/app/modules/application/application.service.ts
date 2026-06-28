import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConstant } from 'src/app/constants/endpoints.constant';
import { environment } from 'src/environments/environment';
import { EmployeeListForInvoice, InsertComments, SaveEmployeeDTO, SpInvoice } from './spInvoice.model';
import { RegisterSPDTO } from './register-company/register-sp.model';
import { CreateAndEditInvoice } from './application.component';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) { }
  GetAllDivisions(): Observable<any> {
    return this.http.get(`${environment.imsApiURL}${EndPointConstant.Invoice.GetAllDivisions()}`);
  }
  GetAllDistricts(val: string): Observable<any> {
    const params = new HttpParams().set('val', val);
    return this.http.get(`${environment.imsApiURL}${EndPointConstant.Invoice.GetAllDistricts()}`, { params });
  }
  GetHfTypes(): Observable<any> {
    return this.http.get(`${environment.imsApiURL}${EndPointConstant.Invoice.GetHfTypes()}`);
  }
  GetHealthFacilities(hftCode: string, code: string): Observable<any> {
    const params = new HttpParams()
        .set('hftCode', hftCode)
        .set('code', code);
    return this.http.get(`${environment.imsApiURL}${EndPointConstant.Invoice.GetHealthFacilities()}`, { params });
  }
  GetServiceTypes(): Observable<any> {
    return this.http.get(`${environment.imsApiURL}${EndPointConstant.Invoice.GetServiceTypes()}`);
  }
  saveInvoice(invoice: SpInvoice): Observable<any> {
    return this.http.post(`${environment.imsApiURL}${EndPointConstant.Invoice.CreateOrEdit()}`, invoice);
  }
  GetInvoices():Observable<any> {
    return this.http.get(`${environment.imsApiURL}${EndPointConstant.Invoice.GetInvoices()}`);
  }
  GetEmployeeListForInvoice(empList: EmployeeListForInvoice):Observable<any> {
    return this.http.post(`${environment.imsApiURL}${EndPointConstant.Invoice.GetEmployeeListForInvoice()}`, empList);
  }
  GetAllEmployeList():Observable<any> {
    return this.http.get(`${environment.imsApiURL}${EndPointConstant.Invoice.GetAllEmployeList()}`)
  }
  SavePartimeEmployee(employee: SaveEmployeeDTO): Observable<any> {
    return this.http.post( `${environment.imsApiURL}${EndPointConstant.Invoice.SavePartimeEmployee()}`,  employee );
  }
  GetEmployeeToEdit(HfSpEmployeeId: any): Observable<any> {
    return this.http.post(
      `${environment.imsApiURL}${EndPointConstant.Invoice.GetEmployeeToEdit()}`,
      { HfSpEmployeeId }
    );
  }
  GetInvoiceById(invoiceId: string): Observable<any> {
    const params = new HttpParams().set('invoiceId', invoiceId);
    return this.http.get(
      `${environment.imsApiURL}${EndPointConstant.Invoice.GetInvoiceById()}`, {params}
     //  invoiceId 
    );
  }
  GetAllInvoiceStatus() :Observable<any> {
    return this.http.get(`${environment.imsApiURL}${EndPointConstant.Invoice.GetAllInvoiceStatus()}`)
  }
  AddNotes(insertComments: InsertComments):Observable<any>{
    return this.http.post(`${environment.imsApiURL}${EndPointConstant.Invoice.AddNotes()}`, insertComments)
  }
  GetInvoiceStatusCount():Observable<any>{
    return this.http.get(`${environment.imsApiURL}${EndPointConstant.Invoice.GetInvoiceStatusCount()}`)
  }
  RegisterCompany(register: RegisterSPDTO):Observable<any>{
    return this.http.post(`${environment.imsApiURL}${EndPointConstant.ServiceProvider.RegisterCompany()}`,register)
  }





  saveInvoiceGama(invoice: CreateAndEditInvoice): Observable<any> {
    return this.http.post(`${environment.ApiURLGama}${EndPointConstant.Invoice.CreateOrEdit()}`, invoice);
  }


  getInvoiceDetailByGuidId() :Observable<any> {
    return this.http.get(`${environment.ApiURLGama}${EndPointConstant.Invoice.getInvoiceDetailByGuidId()}`)
  }

  getInvoiceDetailList(stockcheckFilter) :Observable<any> {
    return this.http.post(`${environment.ApiURLGama}${EndPointConstant.Invoice.GetInvoiceDetailById()}`, stockcheckFilter)
  }

   delete(id: string): Observable<any> {
    return this.http.post(`${environment.ApiURLGama}${EndPointConstant.Invoice.Delete()}?Id=${id}`,id);
  // public delete(id: number): Observable<void> {
  //   return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
  GetViewInvoiceById(id: string): Observable<any> {
    return this.http.post(`${environment.ApiURLGama}${EndPointConstant.Invoice.GetViewInvoiceById()}?Id=${id}`,id);
  }

  updateDueAmount(obj:any): Observable<any> {
    return this.http.post(`${environment.ApiURLGama}${EndPointConstant.Invoice.updateDueAmount()}`,obj);
  }
  
  
  getBillToAndItemAutoComplete() :Observable<any> {
    return this.http.get(`${environment.ApiURLGama}${EndPointConstant.Invoice.getBillToAndItemAutoComplete()}`)
  }
  
  
}
