import { PaginatorModel } from "src/app/core/models/PaginatorModel";


export class TbPatientContactDetailsFilter extends PaginatorModel {
  // User?:any[] = [JSON.parse(localStorage.getItem("user") ?? "").UserId];
  PatientId?:string = '';
  PatientVisitId?:string = '';
  ContactName?:string;
  ContactNo?:string;
  Relation?:string;
  Age:number = 0;
  isSputumCollected:boolean = false;
  CollectedBy:string=''
}