import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { ResourceModel } from '../models/resource.model';

export abstract class ResourceService<T extends ResourceModel<T>> {

  constructor(
    private httpClient: HttpClient,
    private tConstructor: { new (m: Partial<T>, ...args: unknown[]): T },
    protected apiUrl: string
  ) {}

  // public create(resource: Partial<T> & { toJson: () => T }): Observable<T> {
  public create(t: T): Observable<T> {

    // return this.httpClient
    //   .post<T>(`${this.apiUrl}`, resource.toJson())
    //   .pipe(map((result) => new this.tConstructor(result)));

    return this.httpClient.post<T>(`${this.apiUrl}CreateOrEdit`, t);
  }

  public createUserAssignableRoles(t: T): Observable<T> {
     
    return this.httpClient.post<T>(`${this.apiUrl}CreateUserAssignableRoles`, t);
  }


  public get(paginatorModel?:any): Observable<T[]> {
    // return this.httpClient
    //   .get<T[]>(`${this.apiUrl}/GetAll`)
    //   .pipe(map((result) => result.map((i) => new this.tConstructor(i))));

    return this.httpClient.get<T[]>(`${this.apiUrl}GetAll?`+ this.encodeQueryData(paginatorModel))
  }

  // public getById(id: number): Observable<T> {
  //   return this.httpClient
  //     .get<T>(`${this.apiUrl}/${id}`)
  //     .pipe(map((result) => new this.tConstructor(result)));
  public getById(id:any): Observable<T> {

    return this.httpClient.get<T>(`${this.apiUrl}GetById?Id=${id}`);

  }

  public update(id: any, t: T): Observable<T> {
    return this.httpClient.put<T>(`${this.apiUrl}CreateOrEdit/${id}`, t, {});
  // public update(resource: Partial<T> & { toJson: () => T }): Observable<T> {
  //   return this.httpClient
  //     .put<T>(`${this.apiUrl}/${resource.id}`, resource.toJson())
  //     .pipe(map((result) => new this.tConstructor(result)));
  }

  public delete(id: any): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}Delete?Id=${id}`,id);
  // public delete(id: number): Observable<void> {
  //   return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  encodeQueryData(data: any) {
    const ret = [];
    for (let d in data)
    {
      if(data[d] != undefined)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return ret.join('&');
  }
}
