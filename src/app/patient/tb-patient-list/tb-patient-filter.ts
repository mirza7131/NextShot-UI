import { PaginatorModel } from "src/app/core/models/PaginatorModel";


export class TbPatientFilter extends PaginatorModel {
  // User?:any[] = [JSON.parse(localStorage.getItem("user") ?? "").UserId];
  PatientId?:string = '';
  MrNo?:string;
  FullName?:string;
  Cnic?:string;
  Age:number = 0;
  MobileNo:string;
  FormType:string;
  PatientDepartmentLookupId:number = 0;
  PatientSectionLookupId:number = 0;
}
  